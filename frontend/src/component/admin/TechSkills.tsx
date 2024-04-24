"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TechSkill } from "@/constants/TechSkills";
import AddIcon from "@mui/icons-material/Add";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function TechSkills() {
  const { data } = useSession();
  const [techSkills, setTechSkills] = useState<TechSkill[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTechSkillId, setSelectedTechSkillId] = useState<number | null>(null);
  const [isDeleted, setIsDeleted] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/tech-skill", {
        headers: {
          Authorization: `Bearer ${data?.accessToken}`,
        },
      });
      const fetchedData = await response.json();
      setTechSkills(fetchedData);
    };
    if (data) {
      fetchData();
    }
  }, [data, isDeleted]);

  const handleDelete = async (id: number) => {
    // Open the confirmation dialog and set the selected tech skill ID
    setDeleteDialogOpen(true);
    setSelectedTechSkillId(id);
  };

  const handleConfirmDelete = async () => {
    if (selectedTechSkillId !== null) {
      // Add logic to delete the tech skill with the specified ID
      const response = await fetch(`http://localhost:3001/tech-skill/${selectedTechSkillId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data?.accessToken}`,
        },
      });

      if (response.ok) {
        // Update the state after successful deletion
        setTechSkills((prevTechSkills) =>
          prevTechSkills.filter((techSkill) => techSkill.id !== selectedTechSkillId)
        );
      }
      setIsDeleted(true);
      setSnackbarOpen(true);

      setTimeout(() => {
        setIsDeleted(false);
      }, 3000);
    
      // Reset the selected tech skill ID and close the confirmation dialog
      setSelectedTechSkillId(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    // Reset the selected tech skill ID and close the confirmation dialog
    setSelectedTechSkillId(null);
    setDeleteDialogOpen(false);
  };
  
  const handleCreate = () => {
    router.push("/dashboard/tech-skills/create");
  };
  // Snackbar close event handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <>
      <Box>
        <Button variant="contained" onClick={handleCreate} sx={{mb:"8px"}}>
          <AddIcon />
          New Tech Skill
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
            Tech skill deleted successfully!
          </MuiAlert>
        </Snackbar>
        {techSkills.map((q) => (
          <Accordion key={q.id}>
            <AccordionSummary aria-controls="panel1-content" id="panel1-header"  >
            <Box display="flex" alignItems="center" width= "100%">
              <Typography variant="h5">{q.title}</Typography>
              </Box>
              <Button
                sx={{ color: red[500]}} 
                onClick={() => handleDelete(q.id)}
              >
                <DeleteIcon />
              </Button>
            </AccordionSummary>
          </Accordion>
        ))}
      </Box>
       {/* Delete confirmation dialog */}
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
    </>
  );
}
