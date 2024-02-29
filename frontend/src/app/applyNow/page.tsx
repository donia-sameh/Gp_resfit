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
} from "@mui/material";
import * as React from "react";
import { PaletteMode, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../getLPTheme";
import AppBar from "@/component/AppBar";
import Image from "next/image";
import arrow from "/public/arrow.png";
import { ChangeEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { JobVacancy } from "@/constants/JobVacancy";

interface FormData {
  firstName: string;
  lastName: string;
  userName: string;
  jobVacancyId: string;
  email:string;
  phoneNumber:string;
  education: string;
  experience: string;
  language: string;
  resumeFile: File | null;
}
const defaultTheme = createTheme({});

export default function Apply() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mode, setMode] =useState<PaletteMode>("dark");
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));

  const initialFormData = {
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber:"",
    email:"",
    education: "",
    jobVacancyId: "",
    experience: "",
    language: "",
    resumeFile: null,
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { data } = useSession();
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/job-vacany", {
        headers: {
          Authorization: `Bearer ${data?.accessToken}`,
        },
      });
      const fetchedData = await response.json();
      setJobs(fetchedData);
    };

    if (data) {
      fetchData();
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleJobVacancyChange = (e: SelectChangeEvent<string>) => {
    setFormData((prevData) => ({
      ...prevData,
      jobVacancyId: e.target.value,
    }));
    console.log(e);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      resumeFile: e?.target?.files?.[0] ?? null,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("education", formData.education);
    formDataToSend.append("language", formData.language);
    formDataToSend.append("jobVacancyId", formData.jobVacancyId);
    formDataToSend.append("resumeFile", formData.resumeFile || "");
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
        // Handle successful submission
        console.log("You Applied successfully!", formData);
        //setFormData(initialFormData);

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
  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <main>
      <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
        <CssBaseline />
        <AppBar mode={mode} toggleColorMode={toggleColorMode} />
        <Container component="main" maxWidth="sm">
          <Box sx={{ my: 20, bgcolor: "background.paper", p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Apply Now
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="uploadfile">
                    Upload Your Resume
                  </InputLabel>
                  <Box
                  
                    sx={{
                      borderWidth: "3px",
                      borderStyle: "dashed",
                      borderColor: "#136AB3", // Specify borderColor property
                      borderRadius: "10px",
                      padding: "100px", // Wrap padding value in quotes
                      textAlign: "center",
                      marginTop: "20px", // Wrap marginTop value in quotes
                      cursor: "pointer",
                      width: "sm", // Wrap width value in quotes
                    }}
                  >
                    <Image alt="not found" src={arrow} width={50}/>
                      <input
                    name="resumeFile"
                    onChange={handleFileChange}
                    required
                    type="file"
                  />
                  </Box>

                
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="h5" gutterBottom>
                    Select Job You Are Applying For
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Position
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="jobVacancyId"
                      value={formData.jobVacancyId} // Store the selected value in a state variable
                      onChange={handleJobVacancyChange}
                      sx={{ width: "100%" }}
                      label="Position"
                    >
                      {jobs.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.title}
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
      </ThemeProvider>
    </main>
  );
}
