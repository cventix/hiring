import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const JoinMeetingPage: React.FC = () => {
  // Route Params
  const { query } = useRouter();
  const { meeting } = query;

  const cancelMeeting = async (meetingId: string) => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const res = await fetch('/api/meetings/cancel', {
        method: 'PUT',
        body: JSON.stringify({ meetingId }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.status === 404) throw new Error(data.error);
      toast.success('Meeting canceled successfully', { id: toastId, duration: 5000 });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId, duration: 5000 });
    }
  };

  useEffect(() => {
    if (meeting && typeof meeting === 'string') {
      cancelMeeting(meeting);
    }
  }, [meeting]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="mb-4 rounded-3">
        <div className="container">
          <h1 className="display-5 fw-bold mt-0">Canceling the Meeting</h1>
          <p className="col-md-12 fs-4">Please wait...</p>
          <div className="d-flex justify-content-center"></div>
        </div>
      </div>
    </div>
  );
};

export default JoinMeetingPage;
