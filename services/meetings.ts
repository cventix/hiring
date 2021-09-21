import { appwrite } from './appwrite';
import { MEETINGS_COLLECTION_ID } from './constants';
import { IInvitation } from './invitations';
import { IJob } from './jobs';

export interface ICreateMeetingPayload {
  summary?: string;
  description?: string;
  duration: number;
  start: string;
  end?: string;
  timezone: string;
  invitation?: IInvitation;
  link?: string;
  status?: string;
}

export interface IMeeting extends ICreateMeetingPayload {
  $collection: string;
  $id: string;
  $permissions: {
    write: string[];
    read: string[];
  };
  organizer: string;
  job: IJob;
}

export interface IMeetingList {
  sum: number;
  documents: IMeeting[];
}

export const getMeetingsList = async (filters?: string[]): Promise<IMeetingList> => {
  return appwrite.database.listDocuments(MEETINGS_COLLECTION_ID, filters);
};

export const createMeeting = async (
  job: IJob,
  organizer: string,
  payload: ICreateMeetingPayload
): Promise<unknown> => {
  const data = {
    ...payload,
    job: {
      ...job,
      $permissions: { read: ['*'], write: [`user:${organizer}`] },
    },
    organizer,
  };
  return appwrite.database.createDocument(
    MEETINGS_COLLECTION_ID,
    data,
    ['*'],
    [`user:${organizer}`]
  );
};

interface ISetMeetingPayload {
  meetingId: string;
  invitationId: string;
}

export const setMeeting = async (payload: ISetMeetingPayload): Promise<unknown> => {
  const session = appwrite.account.getSession('current');
  if (!session) {
    await appwrite.account.createAnonymousSession();
  }
  return appwrite.functions.createExecution('614753e7025ee', JSON.stringify(payload));
};

export const cancelMeeting = async (meetingId: string): Promise<IMeeting> => {
  return appwrite.database.updateDocument(MEETINGS_COLLECTION_ID, meetingId, {
    status: 'MEETING_CANCELED',
  });
};
