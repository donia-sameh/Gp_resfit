"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function SignInPage() {
  const router = useRouter();

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  async function handleSubmit(event: any) {
    event.preventDefault();
    const status = await signIn("credentials", {
      redirect: false,
      username: event.target.username.value,
      password: event.target.password.value,
    });

    console.log({ status });

    if (status && status.ok) {
      router.push("/"); // Use router.push to navigate
    } else {
      // Handle error cases
      console.error("Authentication failed");
      setSnackbarOpen(true);
    }
  }

  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/">Back to home</Link>
              </Grid>
              <Grid item>
                <Link href="/auth/signup">Do not have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
   
      </Container>
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
               Failed to sign in: Authentication failed
            </MuiAlert>
        </Snackbar>
    </ThemeProvider>
  );
}
