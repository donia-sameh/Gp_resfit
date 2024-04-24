import { JobVacancy } from "@/constants/JobVacancy";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useJobVacancy({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobVacancy>();
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jobId) {
          setLoading(true);
          const response = await fetch(
            `http://localhost:3001/job-vacany/${jobId}`,
            {
              headers: {
                Authorization: `Bearer ${data?.accessToken}`,
              },
            }
          );

          if (response.ok) {
            const jobData = await response.json();
            // Update form data with the fetched job data
            setJob({
              ...jobData,
              screeningQuestions: jobData.screeningQuestions.map(
                (q: any) => q.screening_question
              ),
            });
          } else {
            console.error("Error fetching job data:", response.statusText);
            // Handle error state or display an error message to the user
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
        // Handle network errors or other issues
      }
    };

    if (data) {
      fetchData();
    }
  }, [data, jobId]);

  return {
    job,
    loading
  };
}
