import moment from 'moment-timezone';
import { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { WorkspaceContext } from '../../contexts/workspace-context';
import {
  deleteMeeting,
  getMeetingsList,
  IMeeting,
  sendMeetingReminder,
} from '../../services/meetings';
import { appTZ } from '../../services/constants';
import { useRouter } from 'next/router';
import meetings from '.';

interface IJobMeetings {
  [key: string]: IMeeting[];
}

const JobsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<IJobMeetings>({});
  const [filter, setFilter] = useState<string>('MEETING_RESERVED');
  const { workspace } = useContext(WorkspaceContext);

  // Route Params
  const { query } = useRouter();
  const { job } = query;

  const fetchJobsList = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const today = moment().format('YYYY-MM-DD');
      const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
      const filters: string[] =
        filter === 'ALL'
          ? [
              `workspace=${workspace}`,
              `start>=${today}`,
              `start<=${tomorrow}`,
              `status=NOT_STARTED`,
            ]
          : [
              `workspace=${workspace}`,
              `start>=${today}`,
              `start<=${tomorrow}`,
              `status=${filter}`,
            ];
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

  const handleDeleteMeeting = async (meetingIds: string[]) => {
    const confirm = window.confirm(
      'Are you sure you want to cancel the meeting?'
    );
    if (confirm) {
      toast.promise(deleteMeeting(meetingIds), {
        loading: 'Loading...',
        success: 'Meeting canceled successfully',
        error: 'Error Occured',
      });
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
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="MEETING_RESERVED">Reserved</option>
              <option value="MEETING_CANCELED">Canceled</option>
            </select>
          </div>
        </div>
        <hr />

        {Object.keys(meetings).length ? (
          Object.keys(meetings).map((key) => (
            <div className="mb-5" key={key}>
              <h3>{key}</h3>
              <table className="table mt-5">
                <thead>
                  <tr>
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
                    <tr key={meeting.$id}>
                      <th scope="row">{index + 1}</th>
                      <td>{meeting.summary}</td>
                      <td>
                        {meeting.invitation && meeting.link
                          ? meeting.invitation.name
                          : '-'}
                      </td>
                      <td>
                        {moment(meeting.start).tz(appTZ).format('YYYY/MM/DD')}
                      </td>
                      <td>{`${moment(meeting.start)
                        .tz(appTZ)
                        .format('HH:mm')} - ${moment(meeting.end)
                        .tz(appTZ)
                        .format('HH:mm')}`}</td>
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
                              onClick={() =>
                                window.open(meeting.link, '_blank')
                              }
                            >
                              <img
                                src="/join.svg"
                                alt="join meeting"
                                title="join meeting"
                              />
                            </button>
                            <button
                              disabled={meeting.status === 'MEETING_CANCELED'}
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteMeeting([meeting.$id])}
                            >
                              <img
                                src="/cancel.svg"
                                alt="cancel meeting"
                                title="cancel meeting"
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
          ))
        ) : (
          <div
            className="alert alert-warning d-flex align-items-center"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
              viewBox="0 0 16 16"
              role="img"
              aria-label="Warning:"
            >
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <div>There is no upcomming meeting</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withDashboardLayout(JobsPage);
