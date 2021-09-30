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

export const getMeetingsList = async (
  filters?: string[]
): Promise<IMeetingList> => {
  return appwrite.database.listDocuments(MEETINGS_COLLECTION_ID, filters, 100);
};

export const createMeeting = async (
  job: IJob,
  organizer: string,
  payload: ICreateMeetingPayload,
  workspaceId: string
): Promise<unknown> => {
  const data = {
    ...payload,
    job: {
      ...job,
      $permissions: {
        read: ['*'],
        write: [`user:${organizer}`, `team:${workspaceId}`],
      },
    },
    organizer,
    workspace: workspaceId,
  };
  return appwrite.database.createDocument(
    MEETINGS_COLLECTION_ID,
    data,
    ['*'],
    [`user:${organizer}`, `team:${workspaceId}`]
  );
};

interface ISetMeetingPayload {
  meetingId: string;
  invitationId: string;
}

export const scheduleMeeting = async (
  payload: ISetMeetingPayload
): Promise<unknown> => {
  const res = await fetch('/api/meetings/schedule', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
};

export const cancelMeeting = async (meetingId: string): Promise<IMeeting> => {
  return appwrite.database.updateDocument(MEETINGS_COLLECTION_ID, meetingId, {
    status: 'MEETING_CANCELED',
  });
};

export const sendMeetingReminder = async (
  meeting: IMeeting
): Promise<unknown> => {
  return appwrite.functions.createExecution(
    '6152120c10300',
    JSON.stringify(meeting)
  );
};
