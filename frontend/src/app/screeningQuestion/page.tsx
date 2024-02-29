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
import { Button, CssBaseline, PaletteMode, Stack, TextField } from "@mui/material";
import AppBar from "@/component/AppBar";

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
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
      };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: "background.default",  display: "flex",
            flexDirection: "row",}}>
 
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
           Screening Questions
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography component="h3" variant="subtitle2">
                Tell me about yourself.
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
              <TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={10}
          sx={{ m: 1, width: '80ch' }} 
        />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography component="h3" variant="subtitle2">
                What is your greatest strength?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
              <TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={10}
          sx={{ m: 1, width: '80ch' }} 
        />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3d-content"
                id="panel3d-header"
              >
                <Typography component="h3" variant="subtitle2">
                What is your greatest weakness?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
              <TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={10}
          sx={{ m: 1, width: '80ch' }} 
        />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4d-content"
                id="panel4d-header"
              >
                <Typography component="h3" variant="subtitle2">
                Why should we hire you?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
              <TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={10}
          sx={{ m: 1, width: '80ch' }} 
        />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel5"}
              onChange={handleChange("panel5")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography component="h3" variant="subtitle2">
                Why do you want to work here?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                  <TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={10}
          sx={{ m: 1, width: '80ch' }} 
        />
              </AccordionDetails>
            </Accordion>
            <Stack
            direction={{ xs: "column", sm: "row" }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: "100%", sm: "auto" } ,float:'right'}}
          >
            <Button variant="contained" color="primary" href="/" sx={{width:"300px"}}>
              Submit
            </Button>
          </Stack>
          </Box>
          
        </Container>
             <Box
          id="image"
          sx={(theme) => ({
            mt: { xs: 8, sm: 10 },
            alignSelf: "center",
            height: { xs: 200, sm: 400 },
            width: 400,
            marginRight:10,
            backgroundImage:
              theme.palette.mode === "light"
                ? 'url("/static/screeningQuestion.png")'
                : 'url("/static/screeningQuestion.png")',
            backgroundSize: "cover",
            borderRadius: "10px",
            outline: "1px solid",
            float:'right'
            
          })}
        />
       
      </Box>
    </ThemeProvider>
  );
}
