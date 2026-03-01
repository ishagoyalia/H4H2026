// googleCalendar.js edits - handles OAuth flow and calendar API calls
// gets actual raw data from google calendar api 
import { google } from 'googleapis';

const createOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

function generateAuthUrl(userId) {
  const oAuth2Client = createOAuthClient();
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
    state: userId // Pass userId so we know who authorized
  });
}

async function getTokensFromCode(code) {
  const oAuth2Client = createOAuthClient();
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
}

function getOAuthClientFromTokens(tokens) {
  const oAuth2Client = createOAuthClient();
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

async function listEvents(tokens, { calendarId = 'primary', timeMin, timeMax, maxResults = 10 } = {}) {
  const auth = getOAuthClientFromTokens(tokens);
  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return res.data.items || [];
}

export {
  generateAuthUrl,
  getTokensFromCode,
  listEvents,
};
