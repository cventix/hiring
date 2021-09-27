import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../../services/appwrite-server';
import { MEETINGS_COLLECTION_ID } from '../../../services/constants';
import { IMeeting } from '../../../services/meetings';

type Data = {
  link?: string;
  error?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
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

    if (!meeting) return res.status(404).json({ error: 'Meeting not found!' });

    if (meeting && meeting.status === 'MEETING_CANCELED')
      return res.status(404).json({ error: 'Meeting has been canceled!' });

    if (moment(meeting.start).diff(moment(), 'minutes') > 5)
      return res.status(400).json({
        error: 'You can only join only 5 minutes before the Meeting',
      });

    await database.updateDocument(MEETINGS_COLLECTION_ID, meetingId, {
      status: 'MEETING_ATTENDED',
    });

    return res.status(200).json({ link: meeting.link });
  } catch (error) {
    return res.status(500).json({ error: 'SERVER_ERROR' });
  }
};
