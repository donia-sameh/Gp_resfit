"use client";

import JobVacancyCard from "@/component/applicant/JobVacancyCard";
import useJobVacancies from "@/hooks/useJobVacancies";
import { Container, Grid, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Jobs() {
  const { jobs } = useJobVacancies();
  const { data, status } = useSession();

  const [jobsWithResumes, setJobsWithResumes] = useState<any[]>([]);

  const getResumeByJobVacancyId = async (jobVacancyId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/applicant/resume/${jobVacancyId}`,
        {
          headers: {
            Authorization: `Bearer ${data?.accessToken}`,
          },
          method: "GET",
        }
      );

      return await response.json();
    } catch {
      return null;
    }
  };

  // useEffect(() => {
  //   if (jobs && status === "authenticated") {
  //     const result: any[] = [];
  //     jobs.forEach((j) => {
  //       getResumeByJobVacancyId(j.id).then((resume) => {
  //         result.push({ ...j, resume });
  //       });
  //       result.push(j);
  //     });
  //     setJobsWithResumes(result);
  //   }
  // }, [jobs, status]);

  return (
    <Container>
      <Typography variant="h4">Job Vacancies</Typography>
      <Grid container spacing={2}>
        {jobs.map((job) => {
          return (
            <Grid key={job.id} item xs={6}>
              <JobVacancyCard {...job} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
