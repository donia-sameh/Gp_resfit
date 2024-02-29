"use client"
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MuiAlert from '@mui/material/Alert';

interface FormData {
  title: string;
}

export default function TechSkill() {
  const router = useRouter();

  const initialFormData = {
    title: "",
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { data } = useSession();
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/tech-skill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessSnackbarOpen(true);
        setFormData(initialFormData);
        setTimeout(() => {
          router.push("/dashboard?tab=2");
        }, 800);
      } else {
        console.error("Submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <main>
      <Container component="main" maxWidth="sm">
        <Box sx={{ bgcolor: "background.paper", p: 4 }}>
          <Link
            href="/dashboard?tab=2"
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <ArrowBackIcon />
            Back to Dashboard
          </Link>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Technical Skill
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Tech Skill Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" fullWidth>
                Submit
              </Button>
            </Grid>
          </form>
        </Box>
      </Container>
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert  elevation={6}
            variant="filled" onClose={handleSnackbarClose} severity="success">
          Tech skill created successfully!
        </MuiAlert>
      </Snackbar>
    </main>
  );
}
