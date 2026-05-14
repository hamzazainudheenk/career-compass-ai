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
  console.log("Listing messages with has:attachment...");
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'has:attachment',
    maxResults: 5
  });
  console.log("Messages:", res.data.messages);
}
run().catch(console.error);
