import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { getJobsList, IJob } from '../../services/jobs';
import { createMeeting, ICreateMeetingPayload } from '../../services/meetings';
import { useAuth } from '../../hooks/useAuth';

type DefineMeetingFormType = {
  jobId: string;
  summary: string;
  description: string;
  duration: number;
  date: string;
  timeZone: string;
  start: string;
  end: string;
};

const AddMeetingsPage: React.FC = () => {
  const { account } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<DefineMeetingFormType>();
  const duration = useWatch({ control, name: 'duration', defaultValue: 10 });
  const [jobs, setJobs] = useState<IJob[]>([]);

  const getJobs = async () => {
    const { documents, sum } = await getJobsList();
    setJobs(documents);
  };

  const onSubmit = async (data: DefineMeetingFormType) => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const { date, start, end, jobId, summary, description, timeZone, duration } = data;
      const job = jobs.find((j) => j.$id === jobId);
      const startDate = moment(`${date} ${start}`);
      const endDate = moment(`${date} ${end}`);
      if (endDate.isBefore(startDate)) throw new Error('End must be grater than Start');
      while (startDate.isBefore(endDate)) {
        const payload: ICreateMeetingPayload = {
          summary,
          description,
          duration,
          start: startDate.toISOString(),
          timezone: timeZone ? timeZone : 'Asia/Tehran',
        };
        startDate.add('minutes', duration);
        payload['end'] = startDate.toISOString();

        if (job && account) {
          await createMeeting(job, account.$id, payload);
        }
      }
      toast.success('Successfully Defined', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const renderTimes = () => {
    const start = moment('1970-01-01 00:00');
    const end = moment('1970-01-01 23:59');
    const times = [];
    while (start.isBefore(end)) {
      times.push(start.format('HH:mm'));
      start.add('minutes', duration);
    }
    return times.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ));
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    renderTimes();
  }, [duration]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Meetings</h1>
        <p className="col-md-8 fs-4">
          Define your available times. Candidates can select from the list of available times.
        </p>
        <hr />
        <div className="col-md-7 col-lg-8">
          <h4 className="mb-3">Available times details</h4>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-sm-12">
              <label htmlFor="jobId" className="form-label">
                Select Job
              </label>
              <select
                className="form-select"
                id="jobId"
                {...register('jobId', {
                  required: { message: 'Please select a job', value: true },
                })}
              >
                <option value="">Choose...</option>
                {jobs.map((job) => (
                  <option key={job.$id} value={job.$id}>
                    {job.title}
                  </option>
                ))}
              </select>
              {errors && errors.jobId && (
                <small className="text-danger">{errors.jobId.message}</small>
              )}
            </div>

            <div className="col-12">
              <label htmlFor="summary" className="form-label">
                Summary <span className="text-muted">(Optional)</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="summary"
                placeholder="Summary"
                {...register('summary')}
              />
            </div>

            <div className="col-12">
              <label htmlFor="description" className="form-label">
                Description <span className="text-muted">(Optional)</span>
              </label>
              <textarea
                rows={5}
                className="form-control"
                id="description"
                placeholder="Description"
                {...register('description')}
              />
            </div>

            <div className="col-6">
              <label htmlFor="duration" className="form-label">
                Timezone <span className="text-muted">(Optional)</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="timezone"
                placeholder="Asia/Tehran"
                {...register('timeZone')}
              />
            </div>

            <div className="col-6">
              <label htmlFor="duration" className="form-label">
                Duration <span className="text-muted">(Minutes)</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="duration"
                placeholder="duration"
                {...register('duration', {
                  min: { message: 'Minimun duration is 10 minutes', value: 10 },
                  required: { message: 'Duration is required', value: true },
                })}
              />
              {errors && errors.duration && (
                <small className="text-danger">{errors.duration.message}</small>
              )}
            </div>

            <div className="col-4">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                placeholder="Apartment or suite"
                {...register('date', { required: { message: 'Date is required', value: true } })}
              />
              {errors && errors.date && (
                <small className="text-danger">{errors.date.message}</small>
              )}
            </div>

            <div className="col-md-4">
              <label htmlFor="start" className="form-label">
                Start
              </label>
              <select
                className="form-select"
                id="start"
                {...register('start', {
                  required: { message: 'Start is required', value: true },
                })}
              >
                <option value="">Choose...</option>
                {renderTimes()}
              </select>
              {errors && errors.start && (
                <small className="text-danger">{errors.start.message}</small>
              )}
            </div>

            <div className="col-md-4">
              <label htmlFor="end" className="form-label">
                End
              </label>
              <select
                className="form-select"
                id="end"
                {...register('end', { required: { message: 'End is required', value: true } })}
              >
                <option value="">Choose...</option>
                {renderTimes()}
              </select>
              {errors && errors.end && <small className="text-danger">{errors.end.message}</small>}
            </div>
          </div>

          <hr className="my-4" />

          <button className="w-100 btn btn-primary btn-lg" type="submit">
            Add Available times
          </button>
        </form>
      </div>
    </div>
  );
};

export default withDashboardLayout(AddMeetingsPage);
