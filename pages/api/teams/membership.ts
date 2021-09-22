import type { NextApiRequest, NextApiResponse } from 'next';
import { teams, users } from '../../../services/appwrite-server';
import { INVITATION_CALLBACK_URL } from '../../../services/constants';
import { IMembership } from '../../../services/teams';

type Data = {
  membership?: IMembership;
  error?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Invalid Method' });
  }

  const { teamId, email } = req.body;
  if (!teamId) return res.status(400).json({ error: 'teamId is required' });
  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    const membership: IMembership = await teams.createMembership(
      teamId,
      email,
      ['member'],
      INVITATION_CALLBACK_URL
    );
    await users.updatePrefs(membership.userId, { workspace: teamId });

    return res.status(200).json({ membership });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
