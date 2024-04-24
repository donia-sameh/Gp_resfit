"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Link,
} from "@mui/material";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EducationDropdownItems } from "@/constants/EducationDropdownItems";
import { ScreeningQuestion } from "@/constants/ScreeningQuestions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useJobVacancy from "@/hooks/useJobVacancy";
import { TechSkill } from "@/constants/TechSkills";

interface FormData {
  title: string;
  education: string;
  language: string;
  yearsOfExperience: string;
  description: string;
  skills: TechSkill[];
  screeningQuestions: number[];
}

export default function JobOpening({
  params: { id: jobId },
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const initialFormData = {
    title: "",
    education: "",
    language: "",
    yearsOfExperience: "",
    description: "",
    skills: [{ title: "", weight: "" }],
    screeningQuestions: [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [techSkills, setTechSkills] = useState<{ id: number; title: string }[]>(
    []
  );
  const { data } = useSession();
  const [screeningQuestions, setScreeningQuestions] = useState<
    ScreeningQuestion[]
  >([]);

  const skillOptions = useMemo(
    () => [
      ...techSkills,
      ...formData.skills.filter(
        (x) => !techSkills.find((y) => y.title === x.title)
      ),
    ],
    [techSkills, formData.skills]
  );

  const { job } = useJobVacancy({ jobId });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        education: job.education,
        language: job.language,
        yearsOfExperience: job.yearsOfExperience,
        description: job.jobDescription,
        skills: job.skills,
        screeningQuestions: job.screeningQuestions.map(
          (x: ScreeningQuestion) => x.id
          //(x: any) => x.screening_question.id
        ),
      });
    }
  }, [job]);

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
  }, [data]);

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

  if (!techSkills.length || !screeningQuestions.length) {
    return <></>;
  }

  const handleEducationChange = (e: SelectChangeEvent<string>) => {
    setFormData((prevData) => ({
      ...prevData,
      education: e.target.value,
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateJobSkillSelection = (
    e: SelectChangeEvent<string>,
    index: number
  ) => {
    const updatedJobSkills = [...formData.skills];
    updatedJobSkills[index] = {
      ...updatedJobSkills[index],
      title: e.target.value,
    };
    setFormData((prev) => ({
      ...prev,
      skills: updatedJobSkills,
    }));
  };

  const handleUpdateJobWeightSelection = (
    e: SelectChangeEvent<string>,
    index: number
  ) => {
    const updatedJobSkills = [...formData.skills];
    updatedJobSkills[index] = {
      ...updatedJobSkills[index],
      weight: e.target.value,
    };
    setFormData((prev) => ({
      ...prev,
      skills: updatedJobSkills,
    }));
  };

  const handleAddNewSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { title: "" }],
    }));
  };

  const handleScreeningQuestionsChange = (
    event: SelectChangeEvent<typeof formData.screeningQuestions>
  ) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      screeningQuestions:
        typeof value === "string"
          ? value.split(",").map((id) => parseInt(id, 10))
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
    try {
      const response = await fetch(
        `http://localhost:3001/job-vacany/${jobId}`,
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
        console.log("Job opening updated successfully!", formData);
        setFormData(initialFormData);
        //router.push("/dashboard");
        router.push(`/dashboard?tab=0&jobId=${jobId}`);
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

  const handleDeleteJobSkill = (index: number) => {
    const updatedJobSkills = [...formData.skills];
    updatedJobSkills.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      skills: updatedJobSkills,
    }));
  };

  return (
    <main>
      <Container component="main" maxWidth="sm">
        <Box sx={{ bgcolor: "background.paper", p: 4 }}>
          <Link
            href="/dashboard"
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <ArrowBackIcon /> Back to Dashboard
          </Link>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Job Opening
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="education">Education</InputLabel>
                  <Select
                    labelId="education"
                    id="education"
                    value={formData.education}
                    label="Education"
                    name="education"
                    onChange={handleEducationChange}
                  >
                    {EducationDropdownItems.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Years of Experience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  rows={8}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5" gutterBottom>
                  Technical Skills
                </Typography>
                <Button onClick={handleAddNewSkill}>Add new skill</Button>
              </Grid>
              {formData?.skills?.map((js, index) => (
                <>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="skill">Skill</InputLabel>
                      <Select
                        labelId="skill"
                        id="skill"
                        value={js.title}
                        label="Skill"
                        onChange={(e) =>
                          handleUpdateJobSkillSelection(e, index)
                        }
                      >
                        {skillOptions.map((item) => (
                          <MenuItem key={item.id} value={item.title}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Level
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={js.weight?.toString()} // Store the selected value in a state variable
                        onChange={(e) =>
                          handleUpdateJobWeightSelection(e, index)
                        }
                        sx={{ width: "100%" }}
                        label="Level"
                      >
                        <MenuItem value={2}>Less Important</MenuItem>
                        <MenuItem value={4}>Moderate</MenuItem>
                        <MenuItem value={6}>High</MenuItem>
                        <MenuItem value={8}>Very High</MenuItem>
                        <MenuItem value={10}>Must Have</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    {index != 0 && (
                      <IconButton
                        onClick={() => handleDeleteJobSkill(index)}
                        aria-label="Close"
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Grid>
                </>
              ))}
            </Grid>
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5" gutterBottom>
                  Screening Questions
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="screening-questions-label">
                    Select Questions
                  </InputLabel>
                  <Select
                    label="Select Questions"
                    labelId="screening-questions-label"
                    id="screening-questions"
                    sx={{ width: "100%" }}
                    multiple
                    value={formData.screeningQuestions}
                    onChange={handleScreeningQuestionsChange}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
                    renderValue={(selectedIds) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selectedIds.map((id) => {
                          const selectedName =
                            screeningQuestions.find((x) => x.id === id)
                              ?.question || "";
                          return <Chip key={id} label={selectedName} />;
                        })}
                      </Box>
                    )}
                  >
                    {screeningQuestions.map((q) => (
                      <MenuItem key={q.id} value={q.id}>
                        {q.question}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
