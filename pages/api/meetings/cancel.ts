import type { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../../services/appwrite-server';
import { MEETINGS_COLLECTION_ID } from '../../../services/constants';
import { IMeeting } from '../../../services/meetings';

type Data = {
  status?: string;
  error?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Invalid Method' });
  }

  const { meetingId } = req.body;
  if (!meetingId)
    return res.status(400).json({ error: 'meetingId is required' });

  try {
    const meeting: IMeeting = await database.getDocument(
      MEETINGS_COLLECTION_ID,
      meetingId
    );

    if (meeting && meeting.status === 'MEETING_RESERVED') {
      await database.updateDocument(MEETINGS_COLLECTION_ID, meetingId, {
        status: 'MEETING_CANCELED',
      });
      return res
        .status(200)
        .json({ status: 'Meeting cancelled successfully!' });
    }

    return res.status(404).json({ error: 'Meeting not found!' });
  } catch (error) {
    return res.status(500).json({ error: 'SERVER_ERROR' });
  }
};
