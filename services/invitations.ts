import { appwrite } from './appwrite';
import { IAccount } from './auth';
import { INVITATIONS_COLLECTION_ID, NOTES_COLLECTION_ID } from './constants';
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
  notes: IInvitationNote[];
}

export interface IInvitationNote {
  $collection: string;
  $id: string;
  $permissions: {
    write: string[];
    read: string[];
  };
  user: string;
  text: string;
  invitation: string;
  mentions: string[];
  createdAt: string;
}

export interface IInvitationsList {
  sum: number;
  documents: IInvitation[];
}

export const getInvitations = async (
  filters?: string[]
): Promise<IInvitationsList> => {
  return appwrite.database.listDocuments(INVITATIONS_COLLECTION_ID, filters, 100);
};

export const addInvitationNote = async (
  invitation: IInvitation,
  noteText: string,
  user: IAccount
): Promise<IInvitation> => {
  const note: IInvitationNote = await appwrite.database.createDocument(
    NOTES_COLLECTION_ID,
    {
      user: JSON.stringify({ id: user.$id, name: user.name }),
      invitation: invitation.$id,
      text: noteText,
      createdAt: new Date().toISOString(),
    },
    [`user:${user.$id}`],
    [`user:${user.$id}`]
  );

  // Define notes Array
  let notes = [];
  if (invitation.notes) notes = [...invitation.notes, note];
  else notes = [note];

  return appwrite.database.updateDocument(
    INVITATIONS_COLLECTION_ID,
    invitation.$id,
    { notes }
  );
};
