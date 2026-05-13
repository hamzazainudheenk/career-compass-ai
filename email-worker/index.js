import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
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

const processEmails = async (providedUserId) => {
    const processedResults = [];

    // You need to set these variables in your environment or a local .env file
    if (!process.env.IMAP_USER || !process.env.IMAP_PASSWORD) {
        console.error("Missing IMAP_USER or IMAP_PASSWORD in environment variables.");
        return processedResults;
    }

    const client = new ImapFlow({
        host: process.env.IMAP_HOST || 'imap.gmail.com',
        port: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT) : 993,
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASSWORD
        },
        logger: false
    });

    client.on('error', err => {
        console.error("IMAP Connection Error (Likely Network Drop):", err.message);
    });

    try {
        await client.connect();
        console.log('Connected to IMAP server');

        let lock = await client.getMailboxLock('INBOX');
        try {
            // Find all unseen emails
            const search = { seen: false };
            const messages = await client.fetch(search, { uid: true });

            for await (let msg of messages) {
                console.log(`Processing email UID: ${msg.uid}`);
                
                try {
                    const messageData = await client.fetchOne(msg.uid, { source: true }, {uid: true});
                    console.log(`Downloaded email content, parsing...`);
                    const parsed = await simpleParser(messageData.source);
                    console.log(`Parsed email subject: ${parsed.subject}`);
                
                // Use email body as job description, fallback to subject
                const jobDescription = parsed.text || parsed.subject || "Software Engineer";
                
                // Find PDF attachments
                const pdfAttachments = parsed.attachments.filter(att => att.contentType === 'application/pdf' || att.filename?.toLowerCase().endsWith('.pdf'));

                for (let att of pdfAttachments) {
                    console.log(`Found PDF attachment: ${att.filename}`);
                    try {
                        const pdfData = await pdfParse(att.content);
                        const resumeText = pdfData.text;

                        if (!resumeText || resumeText.trim().length === 0) {
                            console.log(`No text extracted from ${att.filename}`);
                            continue;
                        }

                        console.log(`Analyzing resume from ${att.filename}...`);
                        const analysisResult = await generateResumeAnalysis(resumeText, jobDescription);

                        // Save to Supabase
                        console.log(`Saving analysis result to Supabase...`);
                        
                        // NOTE: You might want to map the sender's email to a Clerk User ID here.
                        // For demonstration, we use a generic placeholder or you can pass a specific user ID.
                        const userId = providedUserId || process.env.DEFAULT_USER_ID || 'email-integration-user';

                        const { error } = await supabase.from('analysis_results').insert({
                            user_id: userId,
                            file_name: att.filename || 'email_attachment.pdf',
                            job_description: jobDescription,
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
                        });

                        if (error) {
                            console.error(`Error saving to Supabase for ${att.filename}:`, error);
                        } else {
                            console.log(`Successfully processed and saved ${att.filename}`);
                            processedResults.push({
                                fileName: att.filename,
                                jobDescription: jobDescription,
                                result: analysisResult
                            });
                        }
                    } catch (err) {
                        console.error(`Failed to process attachment ${att.filename}:`, err.message);
                    }
                }

                } catch (parseErr) {
                    console.error(`Error parsing email UID ${msg.uid}:`, parseErr);
                }

                // Mark email as seen
                await client.messageFlagsAdd(msg.uid, ['\\Seen']);
            }
        } finally {
            lock.release();
        }

        await client.logout();
        console.log('Disconnected from IMAP server');
    } catch (err) {
        console.error("IMAP Error:", err);
    }
    
    return processedResults;
};

let isRunning = false;
const runWorker = async () => {
    if (isRunning) {
        console.log("Previous email check is still running, skipping this interval...");
        return;
    }
    isRunning = true;
    try {
        await processEmails();
    } finally {
        isRunning = false;
    }
};

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/fetch-emails', async (req, res) => {
    if (isRunning) {
        return res.status(429).json({ error: "Email check already in progress" });
    }
    isRunning = true;
    try {
        const userId = req.query.userId || process.env.DEFAULT_USER_ID;
        const results = await processEmails(userId);
        res.json({ success: true, count: results.length, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        isRunning = false;
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Email worker API running on http://localhost:${PORT}`);
    
    // Also run the cron job
    cron.schedule('*/2 * * * *', async () => {
        if (!isRunning) {
            console.log("Running scheduled email check...");
            isRunning = true;
            try {
                await processEmails();
            } finally {
                isRunning = false;
            }
        }
    });
});
