import { appwrite } from './appwrite';
import { INVITATIONS_COLLECTION_ID } from './constants';
import { IJob } from './jobs';
import { IMeeting } from './meetings';

export interface IInvitation {
  $collection: string;
  $id: string;
  $permissions: {
    write: string[];
    read: string[];
  };
  email: string;
  jobinjaId: string;
  mobile: string;
  name: string;
  submittedAt: string;
  job: IJob;
  meeting: IMeeting;
}

export interface IInvitationsList {
  sum: number;
  documents: IInvitation[];
}

export const getInvitations = async (
  filters?: string[]
): Promise<IInvitationsList> => {
  return appwrite.database.listDocuments(INVITATIONS_COLLECTION_ID, filters);
};
