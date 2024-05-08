"use client";

import JobVacancyCard from "@/component/applicant/JobVacancyCard";
import useJobVacancies from "@/hooks/useJobVacancies";
import {Accordion, AccordionDetails, AccordionSummary, Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Applicant } from "@/constants/Applicant";
import useProfile from "@/hooks/useProfile";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

export default function Jobs() {
  const { jobs } = useJobVacancies();
  const { data } = useSession();
  const { profile } = useProfile();

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
  const [applicant, setApplicant] = useState<Applicant>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:3001/applicant/${profile?.id}`,
        {
          headers: {
            Authorization: `Bearer ${data?.accessToken}`,
          },
        }
      );
      const fetchedData = await response.json();
      setApplicant(fetchedData);
    };

    if (data) {
      fetchData();
    }
  },[data, profile?.id]);
  console.log(profile?.resumes)
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
      <Typography variant="h4">Personal Details</Typography>
       <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
     <Typography variant="h6" sx={{ fontWeight: 800 }}> Name:  &nbsp; </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'normal' }}> { profile?.firstName} {profile?.lastName}</Typography>
      </AccordionSummary>
        <AccordionDetails>
      <Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Email</Typography>
                <Typography sx={{ fontWeight: 'normal' }} variant="h6">{profile?.email}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6"sx={{ fontWeight: 800 }}>Phone</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'normal' }}>{profile?.phoneNumber}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Typography variant="h4">Applied Jobs</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell align="right">Resume</TableCell>
                  <TableCell align="right">Total Rating</TableCell>
                  <TableCell align="right">Resume Rating</TableCell>
                  <TableCell align="right">Screening Questions Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profile?.resumes.map(({id,filename,rating,jobVacancy,resume_rating,screening_questions_rating}) => (
            <TableRow
              key={id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
              {jobVacancy.title}
              </TableCell>
              <TableCell align="right"><a href={`http://localhost:3001/applicant/uploads/${filename}`}>download</a></TableCell>
              <TableCell align="right">{rating}</TableCell>
              <TableCell align="right">{resume_rating}</TableCell>
              <TableCell align="right">{screening_questions_rating}</TableCell>
            </TableRow>
          ))}
              </TableBody>
            </Table>
          </TableContainer>
      </Box>
      </AccordionDetails>
      </Accordion>
      <Typography variant="h4" sx={{paddingTop:5}}>Job Vacancies</Typography>
      <Grid container spacing={2} >
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
