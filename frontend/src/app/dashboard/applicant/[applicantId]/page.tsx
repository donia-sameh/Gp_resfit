"use client";
import { Applicant } from "@/constants/Applicant";
import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ApplicantPage({
  params: { applicantId },
}: {
  params: { applicantId: string };
}) {
  const router = useRouter();
  const [applicant, setApplicant] = useState<Applicant>();
  const { data } = useSession();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:3001/applicant/${applicantId}`,
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
  },[applicantId, data]);
  

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap:3}}>
      <Link href="/dashboard" sx={{display:"flex",flexDirection:"row",paddingBottom:2}}><ArrowBackIcon />  Back to Dashboard</Link>
        <Typography variant="h1">{applicant?.firstName} {applicant?.lastName}</Typography>
        <Box>
          <Typography variant="h4" >Contact</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Email</Typography>
                <Typography sx={{ fontWeight: 'normal' }} variant="h6">{applicant?.email}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6"sx={{ fontWeight: 800 }}>Phone</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'normal' }}>{applicant?.phoneNumber}</Typography>
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
                {applicant?.resumes.map(({id, jobVacancy,filename,rating,resume_rating,screening_questions_rating}) => (
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
      </Box>
    </Container>
  );
}
