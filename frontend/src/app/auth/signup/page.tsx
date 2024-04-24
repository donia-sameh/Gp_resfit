"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const validateEmail = (email:any) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/
    );
};

const validatePhoneNumber = (phoneNumber:any) => {
  // This is a simple regex for phone numbers, adjust it according to your needs
  return String(phoneNumber).match(/^\d{11}$/);
};

const validatePassword = (password:any) => {
  const criteria = [
    { regex: /.{8,}/, message: "Password must be at least 8 characters long." },
    { regex: /[A-Z]/, message: "Password must contain at least one uppercase letter." },
    { regex: /[a-z]/, message: "Password must contain at least one lowercase letter." },
    { regex: /[0-9]/, message: "Password must contain at least one number." },
    { regex: /[!@#$%^&*]/, message: "Password must contain at least one special character (e.g., !@#$%^&*)." }
  ];

  for (let i = 0; i < criteria.length; i++) {
    if (!criteria[i].regex.test(password)) {
      return { isValid: false, message: criteria[i].message };
    }
  }

  return { isValid: true, message: "Password meets all requirements." };
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

     // Validation checks
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.email || !formData.password) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    if (!validateEmail(formData.email)) {
      setSnackbarMessage('Invalid email address.');
      setSnackbarOpen(true);
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setSnackbarMessage('Invalid phone number. Format must be 11 digits.');
      setSnackbarOpen(true);
      return;
    }
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setSnackbarMessage(passwordValidation.message);
      setSnackbarOpen(true);
      return;
    }
    // Example: Sending registration request to your NestJS backend
    const response = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        userName: formData.email,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Handle success. You might want to automatically sign the user in now.

      console.log("Registration successful", data);

      // Optional: Sign in the user automatically after registration
      const signInStatus = await signIn("credentials", {
        redirect: false,
        username: formData.email,
        password: formData.password,
      });

      if (signInStatus && signInStatus.ok) {
        router.push("/"); // or any other success route
      }
    } else {
      // Handle registration failure
      console.log("Registration failed", data);
      setSnackbarMessage(data.message || 'Registration failed.'); // Adjust based on your API response
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  id="phoneNumber"
                  autoComplete="tel"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item xs>
                <Link href="/">Back to home</Link>
              </Grid>
              <Grid item>
                <Link href="/auth/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000} // Adjust the duration as needed
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // This positions the Snackbar itself
  ContentProps={{
    sx: {
      justifyContent: 'center', // This centers the content inside the Snackbar
    }
  }}
        >
        <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleSnackbarClose}
              severity="error"
              sx={{ width: '100%', textAlign: 'center' }} 
            >
               {snackbarMessage}
            </MuiAlert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
