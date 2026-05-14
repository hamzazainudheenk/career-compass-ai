import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/callback'
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

async function run() {
  const detail = await gmail.users.messages.get({ userId: 'me', id: '19e221d9307ada63' });
  const payload = detail.data.payload;
  const parts = payload.parts || [];
  const pdfParts = parts.filter(part =>
        part.mimeType === 'application/pdf' ||
        (part.filename && part.filename.toLowerCase().endsWith('.pdf'))
      );
  console.log("pdfParts body:", JSON.stringify(pdfParts.map(p => p.body), null, 2));
}
run().catch(console.error);
