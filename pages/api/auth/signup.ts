import type { NextApiRequest, NextApiResponse } from 'next';
import { users, database } from '../../../services/appwrite-server';
import { IAccount } from '../../../services/auth';
import { REGISTRATION_CODES_COLLECTION_ID } from '../../../services/constants';

type Data = {
  user?: IAccount;
  error?: string;
};

interface IRegCode {
  $id: string;
  $collection: string;
  $permissions: {
    read: string[];
    write: string[];
  };
  user: string;
  code: string;
}

interface IRegCodeResponse {
  sum: number;
  documents: IRegCode[];
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Invalid Method' });
  }

  const { registrationCode, email, password, name } = req.body;
  if (!registrationCode)
    return res.status(400).json({ error: 'registrationCode is required' });
  if (!email) return res.status(400).json({ error: 'email is required' });
  if (!password) return res.status(400).json({ error: 'password is required' });
  if (!name) return res.status(400).json({ error: 'name is required' });

  try {
    const regCode: IRegCodeResponse = await database.listDocuments(
      REGISTRATION_CODES_COLLECTION_ID,
      [`code=${registrationCode}`]
    );
    if (regCode.sum === 0)
      return res.status(400).json({ error: 'registrationCode is not valid!' });

    if (regCode.sum > 0) {
      if (regCode.documents[0].user)
        return res
          .status(400)
          .json({ error: 'registrationCode already used!' });

      // Create Account
      const user: IAccount = await users.create(email, password, name);
      await database.updateDocument(
        REGISTRATION_CODES_COLLECTION_ID,
        regCode.documents[0].$id,
        { user: user.$id }
      );
      return res.status(201).json({ user });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
