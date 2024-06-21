"use client";

import ResumeDropzone from "@/component/applicant/ResumeDropzone";
import useJobVacancy from "@/hooks/useJobVacancy";
import useProfile from "@/hooks/useProfile";
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  TextField,
  Button,
  Link,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ChangeEvent, useEffect, useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  userName: string;
  jobVacancyId: string;
  email: string;
  phoneNumber: string;
  education: string;
  yearsOfExperience: string;
  language: string;
  resumeFile: File | null;
  screeningQuestions: {
    question: string;
    answer: string;
    key_answer: string;
  }[];
}

export default function Jobs({
  params: { jobId },
}: {
  params: { jobId: string };
}) {
  const initialFormData: FormData = {
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    email: "",
    education: "",
    jobVacancyId: jobId,
    yearsOfExperience: "",
    language: "",
    resumeFile: null,
    screeningQuestions: [],
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data } = useSession();
  const { profile } = useProfile();
  const { job, loading } = useJobVacancy({ jobId });
  const router = useRouter();

  const validateEmail = (email:any) => {
    // Regular expression to validate email format and domain
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && /@(gmail|yahoo|hotmail|miuegypt)\.|@(.*\.org)$/.test(email);
  };
  const validatePhoneNumber = (phoneNumber:any) => {
    // This is a simple regex for phone numbers, adjust it according to your needs
    return String(phoneNumber).match(/^\d{11}$/);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (files: File[]) => {
    setFormData((prevData) => ({
      ...prevData,
      resumeFile: files?.[0] ?? null,
    }));
    
  };

  const handleScreeningQuestionsAnswersChange = (
    answer: string,
    index: number
  ) => {
    const newScreeningQuestions = [...formData.screeningQuestions];
    newScreeningQuestions[index].answer = answer;

    setFormData((prevData) => ({
      ...prevData,
      screeningQuestions: newScreeningQuestions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Validate email and phone number formats
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      setIsSubmitted(false);
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      alert("Please enter a valid phone number.");
      setIsSubmitted(false);
      return;
    }

    // Ensure a resume file is selected
    if (!formData.resumeFile) {
      alert("Please upload your resume in PDF format.");
      setIsSubmitted(false);
      return;
    }

    // Handle screening questions being answered
    if (formData.screeningQuestions.some((sq) => sq.answer === "")) {
      alert("Please answer all screening questions.");
      setIsSubmitted(false);
      return;
    }

    console.log(formData);
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("yearsOfExperience", formData.yearsOfExperience);
    formDataToSend.append("education", formData.education);
    formDataToSend.append("language", formData.language);
    formDataToSend.append("jobVacancyId", formData.jobVacancyId);
    formDataToSend.append("resumeFile", formData.resumeFile || "");
    formDataToSend.append(
      "screeningQuestions",
      JSON.stringify(formData.screeningQuestions)
    );
    // Handle form submission logic here
    try {
      const response = await fetch("http://localhost:3001/applicant", {
        headers: {
          Authorization: `Bearer ${data?.accessToken}`,
        },
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const { resumeId} = await response.json();
        // Handle successful submission
        router.push(`/jobs/job=${jobId}/ranking?resumeId=${resumeId}`);
        //setFormData(initialFormData);

        // You might want to clear form data or display a success message
      } else {
        // Handle error
        console.error("Submission failed:", response.statusText);
        setIsSubmitted(false)
        // Display an error message to the user
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setIsSubmitted(false)
      // Handle network errors or other issues
    }
  };

  useEffect(() => {
    if (job && profile && !loading) {
      setFormData({
        ...formData,
        screeningQuestions: job.screeningQuestions.map(
          ({ key_answer, question }, index) => ({
            key_answer,
            question,
            answer: formData?.screeningQuestions[index]?.answer || "",
          })
        ),
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        firstName: profile.firstName,
        lastName: profile.lastName
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job, profile, loading]);

  console.log({ profile });

  if (!job || !profile) {
    return <></>;
  }

  const { title, jobDescription, screeningQuestions } = job;

  console.log({ screeningQuestions });

  return (
    <Container>
      <Box sx={{ mt: 2, bgcolor: "background.paper", p: 2 }}>
        <Link
          href="/jobs"
          sx={{ display: "flex", flexDirection: "row", mb: "30px" }}
        >
          <ArrowBackIcon />
          Back to Jobs
        </Link>
        <Typography variant="body2" gutterBottom>
          Job Opportunity
        </Typography>
        <Typography variant="h3">{title}</Typography>
        <Typography variant="body1">{jobDescription}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Candidate Name</Typography>
        <Typography>
          {profile.firstName} {profile.lastName}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Personal Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ my: 2 }}>
            Education and Qualifications
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Experience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ my: 2 }}>
            Resume (C.V.)
          </Typography>
          <Typography sx={{ my: 2, mt: -1 }}>
            {" "}
            Please upload your CV in PDF format.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ResumeDropzone
                onDropAccepted={handleFileChange}
                selectedFile={formData.resumeFile}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ my: 2 }}>
            Additional Questions
          </Typography>
          <Grid container spacing={2}>
            {formData.screeningQuestions.map((question, index) => (
              <Grid key={index} item xs={12}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {question.question}
                </Typography>
                <TextField
                  name={`screeningQuestions.${index}`}
                  value={formData.screeningQuestions[index]?.answer}
                  onChange={(e) =>
                    handleScreeningQuestionsAnswersChange(e.target.value, index)
                  }
                  fullWidth
                  required
                />
              </Grid>
            ))}
          </Grid>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 4 }}
            onSubmit={handleSubmit}
            disabled={isSubmitted}
          >
            Apply
          </Button>
          {isSubmitted && (
            <Box
              sx={{
                mt: 2,
                p: 1,
                display: "flex",
                gap: 1,
                background: "#f5f5f5",
              }}
            >
              <CircularProgress size={18} />
              <Typography variant="body2">
                We are currently processing your data. Please be patient with
                us.
              </Typography>
            </Box>
          )}
        </form>
      </Box>
    </Container>
  );
}
