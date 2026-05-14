import { google } from 'googleapis';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import cron from 'node-cron';
import express from 'express';
import cors from 'cors';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const getGmailClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/callback'
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const generateResumeAnalysis = async (resumeText, jobDescription) => {
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

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    const outputText = response.text || "";
    const cleanedText = outputText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonResult = JSON.parse(cleanedText);

    if (jsonResult.isValidJD === false) {
        throw new Error(jsonResult.error || "Invalid Job Description");
    }

    delete jsonResult.isValidJD;
    return jsonResult;
};

const processEmails = async (providedUserId, jobDescription) => {
  const processedResults = [];

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    console.error("Missing Gmail OAuth credentials in environment variables.");
    throw new Error("Gmail OAuth credentials not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in your .env file.");
  }

  const gmail = getGmailClient();
  const userId = providedUserId || process.env.DEFAULT_USER_ID || 'email-integration-user';
  const jd = jobDescription || "Software Engineer";

  // Search for emails likely containing resumes (subject or filename contains resume/cv)
  const listResponse = await gmail.users.messages.list({
    userId: 'me',
    q: 'has:attachment (subject:resume OR subject:cv OR filename:resume OR filename:cv)',
    maxResults: 20,
  });

  const messages = listResponse.data.messages || [];
  console.log(`Found ${messages.length} emails with attachments`);

  for (const msg of messages) {
    try {
      const detail = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
      });

      const payload = detail.data.payload;
      const parts = payload.parts || [];
      const headers = payload.headers || [];
      const fromHeader = headers.find(h => h.name === 'From')?.value || 'Unknown';
      const subjectHeader = headers.find(h => h.name === 'Subject')?.value || 'No Subject';

      // Find PDF parts
      const pdfParts = parts.filter(part =>
        part.mimeType === 'application/pdf' ||
        (part.filename && part.filename.toLowerCase().endsWith('.pdf'))
      );

      for (const part of pdfParts) {
        const attachmentId = part.body?.attachmentId;
        if (!attachmentId) continue;

        console.log(`Processing PDF: ${part.filename} from ${fromHeader}`);

        try {
          const attachmentRes = await gmail.users.messages.attachments.get({
            userId: 'me',
            messageId: msg.id,
            id: attachmentId,
          });

          const pdfBuffer = Buffer.from(attachmentRes.data.data, 'base64');

          let resumeText = '';
          try {
            const pdfData = await pdfParse(pdfBuffer);
            resumeText = pdfData.text;
          } catch (pdfErr) {
            // Skip password-protected or corrupted PDFs silently
            console.log(`Skipping ${part.filename}: could not parse PDF (${pdfErr.message})`);
            continue;
          }

          if (!resumeText || resumeText.trim().length === 0) {
            console.log(`No text extracted from ${part.filename}, skipping.`);
            continue;
          }

          console.log(`Analysing resume from ${part.filename}...`);
          const analysisResult = await generateResumeAnalysis(resumeText, jd);

          // Always push the result to the UI, regardless of Supabase save outcome
          processedResults.push({
            fileName: part.filename || 'resume.pdf',
            from: fromHeader,
            emailSubject: subjectHeader,
            jobDescription: jd,
            result: analysisResult,
          });
          console.log(`Analysed ${part.filename} successfully`);

          // Save to Supabase (non-blocking — failure won't stop the result from being returned)
          supabase.from('analysis_results').insert({
            user_id: userId,
            file_name: part.filename || 'email_attachment.pdf',
            job_description: jd,
            fit_score: analysisResult.fitScore,
            candidate_summary: analysisResult.candidateSummary,
            matched_skills: analysisResult.matchedSkills,
            missing_skills: analysisResult.missingSkills,
            unrelated_skills: analysisResult.unrelatedSkills,
            key_achievements: analysisResult.keyAchievements,
            culture_fit: analysisResult.cultureFit,
            probing_areas: analysisResult.probingAreas,
            seniority_assessment: analysisResult.seniorityAssessment,
            red_flags: analysisResult.redFlags,
            interview_questions: analysisResult.interviewQuestions
          }).then(({ error }) => {
            if (error) console.error(`Supabase save error for ${part.filename}:`, error.message);
            else console.log(`Saved ${part.filename} to Supabase`);
          }).catch(err => console.error(`Supabase network error for ${part.filename}:`, err.message));

        } catch (attErr) {
          console.error(`Error processing attachment ${part.filename}:`, attErr.message);
        }
      }

    } catch (msgErr) {
      console.error(`Error processing message ${msg.id}:`, msgErr.message);
    }
  }

  return processedResults;
};

let isRunning = false;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/fetch-emails', async (req, res) => {
  if (isRunning) {
    return res.status(429).json({ error: "Email check already in progress. Please wait." });
  }
  isRunning = true;
  try {
    const userId = req.query.userId || process.env.DEFAULT_USER_ID;
    const jobDescription = req.query.jobDescription || "";
    const results = await processEmails(userId, jobDescription);
    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    isRunning = false;
  }
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3001/auth/callback'
  );
  const { tokens } = await oauth2Client.getToken(code);
  console.log('\n✅ REFRESH TOKEN (save this in your .env as GOOGLE_REFRESH_TOKEN):\n', tokens.refresh_token);
  res.send(`<h2>Success!</h2><p>Copy this refresh token into your .env file as GOOGLE_REFRESH_TOKEN:</p><pre>${tokens.refresh_token}</pre>`);
});

app.get('/auth/gmail', (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3001/auth/callback'
  );
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.modify'],
    prompt: 'consent',
  });
  res.redirect(url);
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Email worker API running on http://localhost:${PORT}`);
});
// Allow up to 5 minutes for long AI analysis requests
server.setTimeout(5 * 60 * 1000);
