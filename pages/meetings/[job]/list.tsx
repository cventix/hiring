import moment from 'moment-timezone';
import React, { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { withDashboardLayout } from '../../../layouts/dashboard-layout';
import { WorkspaceContext } from '../../../contexts/workspace-context';
import {
  cancelMeeting,
  deleteMeeting,
  getMeetingsList,
  IMeeting,
  sendMeetingReminder,
} from '../../../services/meetings';
import { useRouter } from 'next/router';
import produce from 'immer';

interface IJobMeetings {
  [key: string]: IMeeting[];
}

const JobsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<IJobMeetings>({});
  const [selectedMeetings, setSelectedMeetings] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const { workspace } = useContext(WorkspaceContext);

  // Route Params
  const { query } = useRouter();
  const { job } = query;

  const fetchJobsList = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const filters: string[] =
        filter === 'ALL'
          ? [`workspace=${workspace}`, `job.$id=${job}`]
          : [`workspace=${workspace}`, `job.$id=${job}`, `status=${filter}`];
      const list = await getMeetingsList(filters);

      const meetings = list.documents.reduce(
        (state: IJobMeetings, current: IMeeting) => {
          if (!state[current.job.title]) state[current.job.title] = [];
          state[current.job.title].push(current);
          return state;
        },
        {}
      );
      setMeetings(meetings);
      toast.success('Meetings Loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleCancelMeeting = async (meetingIds: string[]) => {
    const confirm = window.confirm(
      'Are you sure you want to cancel the meeting(s)?'
    );
    if (confirm) {
      let toastId;
      try {
        toastId = toast.loading('Loading...');
        await cancelMeeting(meetingIds);
        await fetchJobsList();
        toast.success('Meeting(s) canceled successfully', { id: toastId });
      } catch (error: any) {
        console.error(error);
        toast.error(error.message, { id: toastId });
      }
    }
  };

  const handleDeleteMeeting = async (meetingIds: string[]) => {
    const confirm = window.confirm(
      'Are you sure you want to delete the meeting(s)?'
    );
    if (confirm) {
      let toastId;
      try {
        toastId = toast.loading('Loading...');
        await deleteMeeting(meetingIds);
        await fetchJobsList();
        setSelectedMeetings([]);
        toast.success('Meeting(s) deleted successfully', { id: toastId });
      } catch (error: any) {
        console.error(error);
        toast.error(error.message, { id: toastId });
      }
    }
  };

  const handleSendMeetingReminder = async (meeting: IMeeting) => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      await sendMeetingReminder(meeting);
      toast.success('Reminder sent successfully', { id: toastId });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleSelectMeeting = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedMeetings((prev) =>
      produce(prev, (draft) => {
        if (checked) draft.push(value);
        else {
          const index = draft.indexOf(value);
          draft.splice(index, 1);
        }
      })
    );
  };

  const handleSelectAllMeetings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setSelectedMeetings((prev) =>
      produce(prev, (draft) => {
        if (checked) {
          Object.values(meetings).map((i) =>
            i.map((a) => {
              if (draft.indexOf(a.$id) === -1) draft.push(a.$id);
            })
          );
        } else {
          draft.splice(0, draft.length);
        }
      })
    );
  };

  useEffect(() => {
    if (workspace) fetchJobsList();
  }, [filter, workspace]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Meetings</h1>
        <div className="d-flex justify-content-between">
          <p className="col-md-8 fs-4">
            Here, you can see list of your meetings.
          </p>
          <div className="d-flex align-items-center">
            <strong className="mx-2">Filter:</strong>
            <select
              className="form-control"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="MEETING_RESERVED">Reserved</option>
              <option value="MEETING_CANCELED">Canceled</option>
            </select>
          </div>
        </div>
        <hr />

        {Object.keys(meetings).map((key) => (
          <div className="mb-5" key={key}>
            <div className="d-flex justify-content-between align-items-center">
              <h3>{key}</h3>
              {selectedMeetings.length ? (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteMeeting(selectedMeetings)}
                >
                  Delete Selected ({selectedMeetings.length})
                </button>
              ) : null}
            </div>
            <table className="table mt-5">
              <thead>
                <tr>
                  <th scope="col">
                    <input type="checkbox" onChange={handleSelectAllMeetings} />
                  </th>
                  <th scope="col">#</th>
                  <th scope="col">Summary</th>
                  <th scope="col">Reserved by</th>
                  <th scope="col">Date</th>
                  <th scope="col">Time</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {meetings[key].map((meeting, index: number) => (
                  <tr
                    key={meeting.$id}
                    style={{
                      backgroundColor:
                        meeting.invitation && meeting.link
                          ? '#fff2cb'
                          : '#ffffff',
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        value={meeting.$id}
                        checked={
                          selectedMeetings.findIndex(
                            (i) => i === meeting.$id
                          ) !== -1
                        }
                        onChange={handleSelectMeeting}
                      />
                    </td>
                    <th scope="row">{index + 1}</th>
                    <td>{meeting.summary}</td>
                    <td>
                      {meeting.invitation && meeting.link
                        ? meeting.invitation.name
                        : '-'}
                    </td>
                    <td>{moment(meeting.start).format('YYYY/MM/DD')}</td>
                    <td>{`${moment(meeting.start).format('HH:mm')} - ${moment(
                      meeting.end
                    ).format('HH:mm')}`}</td>
                    <td>
                      {meeting.status === 'MEETING_CANCELED' ? (
                        <span className="badge bg-secondary">Canceled</span>
                      ) : (
                        <>
                          <button
                            disabled={meeting.status !== 'MEETING_RESERVED'}
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSendMeetingReminder(meeting)}
                          >
                            <img
                              src="/sms-reminder.svg"
                              alt="sms reminder"
                              title="sms reminder"
                            />
                          </button>
                          <button
                            disabled={meeting.status !== 'MEETING_RESERVED'}
                            className="btn btn-warning btn-sm mx-1"
                            onClick={() => window.open(meeting.link, '_blank')}
                          >
                            <img
                              src="/join.svg"
                              alt="join meeting"
                              title="join meeting"
                            />
                          </button>
                          <button
                            disabled={meeting.status === 'MEETING_CANCELED'}
                            className="btn btn-warning btn-sm mx-1"
                            onClick={() => handleCancelMeeting([meeting.$id])}
                          >
                            <img
                              src="/cancel.svg"
                              alt="cancel meeting"
                              title="cancel meeting"
                            />
                          </button>
                          <button
                            disabled={meeting.status === 'MEETING_CANCELED'}
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteMeeting([meeting.$id])}
                          >
                            <img
                              src="/delete.svg"
                              alt="delete meeting"
                              title="delete meeting"
                            />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withDashboardLayout(JobsPage);
