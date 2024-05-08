"use client";


import useJobVacancy from "@/hooks/useJobVacancy";
import { Button, Chip, Container, Typography } from "@mui/material";
import Link from "next/link";


export default function Jobs({
  params: { jobId },
}: {
  params: { jobId: string };
}) {
  const { job } = useJobVacancy({ jobId });

  if (!job) {
    return <></>;
  }

  const { id, title, jobDescription, skills } = job;

  return (
    <Container>
      
      <Typography variant="h3">{title}</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Description
      </Typography>
      <Typography variant="body1">{jobDescription}</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Tech Skills
      </Typography>
      <Typography variant="body1">
        {skills.map((s) => (
          <Chip key={s.id} sx={{ mr: 1 }} label={s.title} variant="outlined" />
        ))}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        How to Apply
      </Typography>
      <Typography variant="body1">
        To apply, please click the button below to start the process
      </Typography>
      <Link href={`/jobs/${id}/apply`}>
        <Button variant="contained">Apply Now</Button>
      </Link>
    </Container>
  );
}
