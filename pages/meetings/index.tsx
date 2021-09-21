import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { cancelMeeting, getMeetingsList, IMeeting } from '../../services/meetings';

interface IJobMeetings {
  [key: string]: IMeeting[];
}

const JobsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<IJobMeetings>({});
  const [filter, setFilter] = useState<string>('ALL');

  const fetchJobsList = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const filters: string[] = filter === 'ALL' ? [] : [`status=${filter}`];
      const list = await getMeetingsList(filters);

      const meetings = list.documents.reduce((state: IJobMeetings, current: IMeeting) => {
        if (!state[current.job.title]) state[current.job.title] = [];
        state[current.job.title].push(current);
        return state;
      }, {});
      setMeetings(meetings);
      toast.success('Meetings Loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    const confirm = window.confirm('Are you sure you want to cancel the meeting?');
    if (confirm) {
      toast.promise(cancelMeeting(meetingId), {
        loading: 'Loading...',
        success: 'Meeting canceled successfully',
        error: 'Error Occured',
      });
    }
  };

  useEffect(() => {
    fetchJobsList();
  }, [filter]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Meetings</h1>
        <div className="d-flex justify-content-between">
          <p className="col-md-8 fs-4">Here, you can see list of your meetings.</p>
          <div className="d-flex align-items-center">
            <strong className="mx-2">Filter:</strong>
            <select className="form-control" onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">ALL</option>
              <option value="MEETING_RESERVED">Reserved</option>
              <option value="MEETING_CANCELED">Canceled</option>
            </select>
          </div>
        </div>
        <hr />

        {Object.keys(meetings).map((key) => (
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
                    <td>{meeting.invitation && meeting.link ? meeting.invitation.name : '-'}</td>
                    <td>{moment(meeting.start).format('YYYY/MM/DD')}</td>
                    <td>{`${moment(meeting.start).format('HH:mm')} - ${moment(meeting.end).format(
                      'HH:mm'
                    )}`}</td>
                    <td>
                      <button
                        disabled={meeting.status === 'MEETING_CANCELED'}
                        className="btn btn-warning btn-sm mx-1"
                        onClick={() => handleCancelMeeting(meeting.$id)}
                      >
                        Join
                      </button>
                      <button
                        disabled={meeting.status === 'MEETING_CANCELED'}
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelMeeting(meeting.$id)}
                      >
                        Cancel
                      </button>
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
