import { JobVacancy } from "@/constants/JobVacancy";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useJobVacancies() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const { data } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/job-vacany", {
        headers: {
          Authorization: `Bearer ${data?.accessToken}`,
        },
      });
      const fetchedData = await response.json();
      setJobs(fetchedData);
      setSelectedJob(fetchedData[0]);
      const jobIdFromUrl = window.location.search.match(/jobId=(\d+)/)?.[1];
      if (jobIdFromUrl) {
        // Find the job in the fetchedData that matches the jobId from the URL
        const jobToSelect = fetchedData.find(
          (job: JobVacancy) => job.id === +jobIdFromUrl
        );
        if (jobToSelect) {
          // Set the selected job based on the URL parameter
          setSelectedJob(jobToSelect);
        }
      }
    };

    if (data) {
      fetchData();
    }
  }, [data]);

  return {
    jobs,
    selectedJob,
    setJobs,
    setSelectedJob,
  };
}
