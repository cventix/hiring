import type { NextApiRequest, NextApiResponse } from 'next';
import { functions } from '../../../services/appwrite-server';

type Data = {
  status?: string;
  error?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Invalid Method' });
  }

  const { meetingId, invitationId } = req.body;
  if (!meetingId)
    return res.status(400).json({ error: 'meetingId is required' });
  if (!invitationId)
    return res.status(400).json({ error: 'invitationId is required' });

  try {
    await functions.createExecution(
      '614753e7025ee',
      JSON.stringify({ meetingId, invitationId })
    );

    return res.status(200).json({ status: 'Meeting scheduled successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'SERVER_ERROR' });
  }
};
