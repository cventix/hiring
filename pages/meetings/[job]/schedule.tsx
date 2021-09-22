import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DayPickerSingleDateController } from 'react-dates';
import toast from 'react-hot-toast';
import {
  getMeetingsList,
  IMeeting,
  scheduleMeeting,
} from '../../../services/meetings';

const ScheduleMeetingPage: React.FC = () => {
  // Route Params
  const { query } = useRouter();
  const { job, invitation, w } = query;

  const [date, setDate] = useState<Moment | null>(moment());
  const [focused, setFocused] = useState(false);
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<IMeeting[]>([]);

  const fetchJobsList = async (
    jobId: string,
    workspaceId: string
  ): Promise<void> => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const list = await getMeetingsList([
        `workspace=${workspaceId}`,
        `job.$id=${jobId}`,
        'job.isEnabled=1',
      ]);
      setMeetings(list.documents);
      toast.success('Available meetings loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleSetMeeting = async (meetingId: string): Promise<void> => {
    if (typeof job === 'string' && typeof invitation === 'string') {
      let toastId;
      try {
        toastId = toast.loading('Loading...');
        await scheduleMeeting({ meetingId, invitationId: invitation });
        toast.success('Successfully Scheduled', { id: toastId });
      } catch (error: any) {
        console.error(error);
        toast.error(error.message, { id: toastId });
      }
    }
  };

  useEffect(() => {
    if (job && typeof job === 'string' && w && typeof w === 'string') {
      fetchJobsList(job, w);
    }
  }, [job, w]);

  useEffect(() => {
    if (date) {
      setFilteredMeetings(
        meetings.filter(
          (m) =>
            moment(m.start).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
        )
      );
    }
  }, [date, meetings]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="mb-4 rounded-3">
        <div className="container">
          <h1 className="display-5 fw-bold mt-0">Schedule Meeting</h1>
          <p className="col-md-12 fs-4">
            Please Select a date to see the available times. then schedule a
            meeting.
          </p>
          <div className="d-flex justify-content-center">
            <DayPickerSingleDateController
              isOutsideRange={(day) =>
                day.isBefore(moment().subtract(1, 'day'))
              }
              isDayHighlighted={(day) =>
                meetings
                  .map((m) => moment(m.start).format('YYYY-MM-DD'))
                  .some((d) => d === day.format('YYYY-MM-DD'))
              }
              onDateChange={setDate}
              onFocusChange={({ focused }) => setFocused(focused)}
              focused={focused}
              date={date}
              initialVisibleMonth={null}
              hideKeyboardShortcutsPanel={true}
              calendarInfoPosition="top"
              numberOfMonths={1}
            />
            <div
              style={{ width: 1, backgroundColor: '#000' }}
              className="mx-4"
            ></div>
            <div className="d-flex flex-column" style={{ width: 300 }}>
              {filteredMeetings.map((meeting) => (
                <button
                  key={meeting.$id}
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={() => handleSetMeeting(meeting.$id)}
                >
                  {moment(meeting.start).format('HH:mm')} -{' '}
                  {moment(meeting.end).format('HH:mm')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingPage;
