import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { users } from '../../../../services/appwrite-server';

type Data = {
  status?: string;
  error?: string;
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Invalid Method' });
  }

  const { code, userId } = req.body;
  if (!code) return res.status(400).json({ error: 'code is required' });
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } =
    process.env;
  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL
  );

  oAuth2Client.getToken(code, async (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    if (token) {
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executionss
      const prefs: object = await users.getPrefs(userId);
      users.updatePrefs(userId, { ...prefs, token });
    }
  });

  return res.status(200).json({ status: 'OK' });
};
