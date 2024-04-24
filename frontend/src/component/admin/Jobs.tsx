"use client";

import { JobVacancy } from "@/constants/JobVacancy";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import { Applicant } from "@/constants/Applicant";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { ScreeningQuestion } from "@/constants/ScreeningQuestions";
import { TechSkill } from "@/constants/TechSkills";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { red } from "@mui/material/colors";
import useJobVacancies from "@/hooks/useJobVacancies";

export default function Jobs() {
  const { data } = useSession();
  const { jobs, selectedJob, setSelectedJob, setJobs } = useJobVacancies();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [screeningQuestions, setScreeningQuestions] = useState<
    ScreeningQuestion[]
  >([]);
  const [techSkill, setTechSkill] = useState<TechSkill[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const sortedApplicants = [...applicants].sort((a, b) => parseInt(b.rating) - parseInt(a.rating));

  useEffect(() => {
    if (selectedJob && data) {
      const fetchData = async () => {
        const response = await fetch(
          `http://localhost:3001/job-vacany/applicants/${selectedJob.id}`,
          {
            headers: {
              Authorization: `Bearer ${data?.accessToken}`,
            },
          }
        );
        const fetchedData = await response.json();
        setApplicants(fetchedData);
      };

      fetchData();
    }
  }, [selectedJob, data]);

  useEffect(() => {
    if (selectedJob && data) {
      const fetchData = async () => {
        const response = await fetch(
          `http://localhost:3001/job-vacany/tech-skill/${selectedJob.id}`,
          {
            headers: {
              Authorization: `Bearer ${data?.accessToken}`,
            },
          }
        );
        const fetchedData = await response.json();
        setTechSkill(fetchedData);
      };

      fetchData();
    }
  }, [selectedJob, data]);

  useEffect(() => {
    if (selectedJob && data) {
      const fetchData = async () => {
        const response = await fetch(
          `http://localhost:3001/job-vacany/screening-questions/${selectedJob.id}`,
          {
            headers: {
              Authorization: `Bearer ${data?.accessToken}`,
            },
          }
        );
        const fetchedData = await response.json();
        setScreeningQuestions(fetchedData);
      };

      fetchData();
    }
  }, [selectedJob, data]);

  const handleSelectedJob = (job: JobVacancy) => {
    setSelectedJob(job);
    router.push(`/dashboard/?tab=0&jobId=${job.id}`);
  };

  const handleCreateJob = () => {
    router.push("/dashboard/jobs/create");
  };

  const handleEditJob = (jobId?: number) => {
    // Add logic to handle editing job
    router.push(`/dashboard/jobs/update/${jobId}`);
  };
  const handleDelete = async (id: number | undefined) => {
    // Open the confirmation dialog and set the selected tech skill ID
    setDeleteDialogOpen(true);
    setSelectedJobId(id ?? null);
  };
  const handleConfirmDelete = async () => {
    if (selectedJobId !== undefined && selectedJobId !== null) {
      // Add logic to delete the tech skill with the specified ID
      const response = await fetch(
        `http://localhost:3001/job-vacany/${selectedJobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        // Update the state after successful deletion
        setJobs((prevTechSkills) =>
          prevTechSkills.filter((job) => job.id !== selectedJobId)
        );
      }
      setIsDeleted(true);
      setSnackbarOpen(true);

      setTimeout(() => {
        setIsDeleted(false);
      }, 3000);

      // Reset the selected tech skill ID and close the confirmation dialog
      setSelectedJobId(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setSelectedJobId(null);
    setDeleteDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  if (!jobs.length) {
    return <></>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Button variant="contained" onClick={handleCreateJob} sx={{mb:"8px"}}>
          <AddIcon />
          New Job
        </Button>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          aria-label="contacts"
        >
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleSnackbarClose}
              severity="success"
            >
              Job deleted successfully!
            </MuiAlert>
          </Snackbar>
          {jobs.map((job) => (
            <ListItem disablePadding key={job.id}>
              <ListItemButton
                onClick={() => handleSelectedJob(job)}
                selected={job.id === selectedJob?.id}
              >
                <ListItemText inset primary={job.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={8}>
        <Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="h3">{selectedJob?.title}</Typography>
            <Button
              sx={{ marginTop: "10px", marginLeft: "10px" }}
              onClick={() => handleEditJob(selectedJob?.id)}
            >
              <EditIcon />
            </Button>
            <Button
              onClick={() => handleDelete(selectedJob?.id)}
              sx={{ color: red[500], marginTop: "10px" }}
            >
              <DeleteIcon />
            </Button>
            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
              <DialogTitle>Delete Tech Skill</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this tech skill?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Typography variant="body1">{selectedJob?.jobDescription}</Typography>
        </Box>
        <Typography variant="h5" sx={{ pt: 4, pb: 2 }}>
          Applicants
        </Typography>
        {applicants.length ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Phone Number</TableCell>
                  <TableCell align="right">Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedApplicants.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.firstName} {row.lastName} 
                    </TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.phoneNumber}</TableCell>
                    <TableCell align="right">
                      <Rating value={parseInt(row.rating)} readOnly />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2">No Applicants to Show</Typography>
        )}

        <Typography variant="h5" sx={{ pt: 4, pb: 2 }}>
          Screening Questions
        </Typography>
        {screeningQuestions.length ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Key Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {screeningQuestions.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.question}
                    </TableCell>
                    <TableCell>{row.key_answer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2">
            No Screening Questions to Show
          </Typography>
        )}
        <Typography variant="h5" sx={{ pt: 4, pb: 2 }}>
          Technical Skills
        </Typography>
        {techSkill.length ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {techSkill.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.weight}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2">No Tech Skills to Show</Typography>
        )}
      </Grid>
    </Grid>
  );
}
