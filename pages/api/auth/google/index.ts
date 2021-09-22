import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  redirectUrl: string;
};

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } =
    process.env;
  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL
  );

  const redirectUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  return res.status(200).json({ redirectUrl });
};
