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
  const listResponse = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread',
    maxResults: 5,
  });
  const messages = listResponse.data.messages || [];
  
  for (const msg of messages) {
    const detail = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
    });
    const headers = detail.data.payload.headers || [];
    const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
    const hasAttachments = detail.data.payload.parts ? detail.data.payload.parts.some(p => p.filename && p.filename.length > 0) : false;
    console.log(`Message: "${subject}" - Has Attachments Object? ${hasAttachments}`);
  }
};

run().catch(console.error);
