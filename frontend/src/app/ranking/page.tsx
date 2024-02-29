"use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import getLPTheme from "../getLPTheme";
import Rating from '@mui/material/Rating';
import {
  Button,
  CssBaseline,
  PaletteMode,
  Stack,
  TextField,
} from "@mui/material";
import AppBar from "@/component/AppBar";
import CircularWithValueLabel from "@/component/circularProgressLabel";
const defaultTheme = createTheme({});

export default function ScreeningQuestion() {
  const [mode, setMode] = React.useState<PaletteMode>("dark");
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppBar mode={mode} toggleColorMode={toggleColorMode} />
      
      <Box
        sx={{
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "row",
        }}
      >
      
        <Container
          id="faq"
          sx={{
            pt: { xs: 4, sm: 12 },
            pb: { xs: 8, sm: 16 },
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 3, sm: 6 },
          }}
        >
          <Typography
            component="h2"
            variant="h4"
            color="text.primary"
            sx={{
              width: { sm: "100%", md: "60%" },
              textAlign: { sm: "left", md: "center" },
            }}
          >
            Ranking Against Job Required
          </Typography>
          <CircularWithValueLabel />
          <Rating name="half-rating-read" defaultValue={3.5} precision={0.5} readOnly />
          <Typography variant="h6" textAlign="center" color="text.secondary">
          Congratulations! 🎉 Achieving an 80% match in your CV against the job requirements is a remarkable accomplishment.Your skills, experience, and qualifications align closely with what the position demands, showcasing a strong compatibility. This outstanding match reflects your careful consideration of the job&apos;s expectations and your ability to present a well-tailored CV. Best of luck as you progress through the recruitment process — your dedication to a precise fit is sure to make a positive impact! 👏🌟
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/screeningQuestion"
            sx={{ width: "300px" }}
          >
            Continue
          </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
