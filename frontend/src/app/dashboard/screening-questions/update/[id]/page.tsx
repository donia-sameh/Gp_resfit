"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  Link,
} from "@mui/material";
import { ChangeEvent, useState ,useEffect} from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface FormData {
  question: string;
  key_answer: string;
}

export default function JobOpening({
  params: { id: questionId },
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const initialFormData = {
    question: "",
    key_answer: "",
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { data } = useSession();

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        if (questionId) {
          const response = await fetch(
            `http://localhost:3001/screening-questions/${questionId}`,
            {
              headers: {
                Authorization: `Bearer ${data?.accessToken}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            // Update form data with the fetched screening question data
            setFormData({
              question: data.question ,
              key_answer: data.key_answer,
            });
          } else {
            console.error("Error fetching job data:", response.statusText);
            // Handle error state or display an error message to the user
          }
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
        // Handle network errors or other issues
      }
    };

    fetchQuestionData(); // Fetch job data when the component mounts
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
    try {
      const response = await fetch(
        `http://localhost:3001/screening-questions/${questionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.accessToken}`,
          },
          body: JSON.stringify(formData), // Send form data as JSON
        }
      );

      if (response.ok) {
        // Handle successful submission
        console.log("Screening question Updated successfully!", formData);
        setFormData(initialFormData);
        router.push("/dashboard?tab=1");
        // You might want to clear form data or display a success message
      } else {
        // Handle error
        console.error("Submission failed:", response.statusText);
        // Display an error message to the user
      }
    } catch (error) {
      console.error("Error during submission:", error);
      // Handle network errors or other issues
    }
  };
  return (
    <main>
      <Container component="main" maxWidth="sm">
        <Box sx={{ bgcolor: "background.paper", p: 4 }}>
          <Link href="/dashboard?tab=1" sx={{display:"flex",flexDirection:"row"}}><ArrowBackIcon />Back to Dashboard</Link>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Screening Question
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Key Answer"
                  name="key_answer"
                  value={formData.key_answer}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  rows={8}
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
    </main>
  );
}
