import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';

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

const run = async () => {
  const gmail = getGmailClient();
  console.log("Fetching emails...");
  const listResponse = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread has:attachment',
    maxResults: 5,
  });
  const messages = listResponse.data.messages || [];
  console.log(`Found ${messages.length} messages`);

  for (const msg of messages) {
    const detail = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
    });
    const payload = detail.data.payload;
    console.log(`Message ${msg.id}: parts count = ${payload.parts ? payload.parts.length : 0}`);
    if (payload.parts) {
      for (const part of payload.parts) {
        console.log(` - Part mimeType: ${part.mimeType}, filename: ${part.filename}`);
      }
    }
  }
};

run().catch(console.error);
