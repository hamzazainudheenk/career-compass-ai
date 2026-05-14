import { GoogleGenAI } from '@google/genai';
import { AnalysisResult } from './analysisService';

// Initialize the Gemini AI client
const getAiClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateResumeAnalysis = async (
    resumeText: string,
    jobDescription: string
): Promise<AnalysisResult> => {
    const ai = getAiClient();

    const prompt = `
  You are an expert HR recruiter and technical screener.
  You are tasked with analyzing a candidate's resume against a provided job description.
  
  CRITICAL: First, validate the Job Description. If the provided Job Description looks fake, like gibberish, or just a few random words (e.g., "fake job description test"), you MUST return an error payload.
  
  If the Job Description is valid, perform a thorough analysis and return a JSON object with the following exact structure:
  {
    "isValidJD": true,
    "fitScore": <number between 0 and 100 based on exact skill match and experience>,
    "candidateSummary": "<A brief, objective 2-3 sentence summary of the candidate's profile for the HR team>",
    "matchedSkills": ["skill1", "skill2"],
    "missingSkills": ["skill1", "skill2"],
    "unrelatedSkills": ["skill1"],
    "keyAchievements": ["<Extract specific, quantifiable achievements or metrics if found. E.g., 'Increased revenue by 20%'>"],
    "cultureFit": "<A 1-2 sentence assessment of the candidate's professional style based on tone and wording (e.g., highly collaborative, autonomous, process-driven)>",
    "probingAreas": [
      {
        "title": "<Short actionable title identifying a weak spot or unverified claim>",
        "description": "<Detailed explanation of what to grill the candidate on to verify their claim>"
      }
    ],
    "seniorityAssessment": "<Estimate their true seniority level based on responsibilities and compare it to the required level of the Job Description>",
    "redFlags": ["<Identify job hopping, employment gaps, generic claims, or missing critical requirements. Leave empty if none.>"],
    "interviewQuestions": ["<3-4 tailored interview questions based on their experience and skill gaps to probe during the interview>"]
  }

  If the Job Description is INVALID/FAKE, return this exact JSON structure:
  {
    "isValidJD": false,
    "error": "The provided job description appears to be invalid or too short to perform a meaningful analysis."
  }

  Here is the Job Description:
  """
  ${jobDescription}
  """

  Here is the Candidate's Resume:
  """
  ${resumeText}
  """
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const outputText = response.text || "";
        // Clean up potential markdown formatting if the model still wraps in ```json
        const cleanedText = outputText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const jsonResult = JSON.parse(cleanedText);

        if (jsonResult.isValidJD === false) {
            throw new Error(jsonResult.error || "Invalid Job Description");
        }

        // Clean up internal valid flag before returning
        delete jsonResult.isValidJD;
        return jsonResult as AnalysisResult;

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw new Error(error.message || "Failed to generate AI analysis.");
    }
};
