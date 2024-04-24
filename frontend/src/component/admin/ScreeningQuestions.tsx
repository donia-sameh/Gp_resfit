"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ScreeningQuestion } from "@/constants/ScreeningQuestions";
import AddIcon from "@mui/icons-material/Add";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function ScreeningQuestions() {
  const { data } = useSession();
  const [screeningQuestions, setScreeningQuestions] = useState<
    ScreeningQuestion[]
  >([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedScreeningQuestionId, setScreeningQuestionId] = useState<number | null>(null);
  const [isDeleted, setIsDeleted] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:3001/screening-questions",
        {
          headers: {
            Authorization: `Bearer ${data?.accessToken}`,
          },
        }
      );
      const fetchedData = await response.json();
      setScreeningQuestions(fetchedData);
    };
    if (data) {
      fetchData();
    }
  }, [data]);

  const handleCreate = () => {
    router.push("/dashboard/screening-questions/create");
  };
  const handleEditQuestion = (questionId?:number) => {
    // Implement logic to handle editing the question with the specified ID
    router.push(`/dashboard/screening-questions/update/${questionId}`);
  };
  const handleDelete = async (id: number) => {
    // Open the confirmation dialog and set the selected tech skill ID
    setDeleteDialogOpen(true);
    setScreeningQuestionId(id);
  };

  const handleConfirmDelete = async () => {
    if (selectedScreeningQuestionId !== null) {
      // Add logic to delete the tech skill with the specified ID
      const response = await fetch(`http://localhost:3001/screening-questions/${selectedScreeningQuestionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data?.accessToken}`,
        },
      });

      if (response.ok) {
        // Update the state after successful deletion
        setScreeningQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== selectedScreeningQuestionId)
      );
      }
      setIsDeleted(true);
      setSnackbarOpen(true);

      setTimeout(() => {
        setIsDeleted(false);
      }, 3000);
    
      // Reset the selected tech skill ID and close the confirmation dialog
      setScreeningQuestionId(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    // Reset the selected tech skill ID and close the confirmation dialog
    setScreeningQuestionId(null);
    setDeleteDialogOpen(false);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <>
      <Box>
        <Button variant="contained" onClick={handleCreate} sx={{mb:"8px"}}>
          <AddIcon />
          New Question
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity="success"
          >
            Screening question deleted successfully!
          </MuiAlert>
        </Snackbar>
        {screeningQuestions.map((q) => (
          <Accordion key={q.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h5">{q.question}</Typography>
              <Button onClick={() => handleEditQuestion(q.id)}>
                <EditIcon />
              </Button>
              <Button  onClick={() => handleDelete(q.id)}  sx={{ color: red[500]}} >
                <DeleteIcon />
                </Button>
            </AccordionSummary>
            <AccordionDetails>{q.key_answer}</AccordionDetails>
          </Accordion>
        ))}
      </Box>
       {/* Delete confirmation dialog */}
       <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete  Screening question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this screening question?
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
    </>
  );
}
