"use client";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { Alert, Button, Paper } from "@mui/material";
import CircularWithValueLabel from "@/component/circularProgressLabel";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import { useSession } from "next-auth/react";

export default function Ranking() {
  const params = useSearchParams();
  const Id = params.get("resumeId");
  const { data } = useSession();
  const [resume, setResume] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3001/resume/${Id}`, {
        headers: {
          Authorization: `Bearer ${data?.accessToken}`,
        },
      });
      const fetchedData = await response.json();
      setResume(fetchedData);
    };

    if (data) {
      fetchData();
    }
  }, [data, Id]);

  if (!resume) {
    return null;
  }

  const {
    rating: rank,
    resume_rating: resume_rank,
    screening_questions_rating: screening_rating,
    resume_feedback_conclusion,
    resume_feedback_needsToImprove,
    resumeScreeningQuestionsAnswers,
  } = resume;
  console.log({ resumeScreeningQuestionsAnswers });
  const rankPercentage = (100 / 5) * parseInt(rank);

  return (
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
        <CircularWithValueLabel rank={parseInt(rank)} />
        <Rating
          name="half-rating-read"
          defaultValue={rank}
          precision={1}
          readOnly
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ mb: 8 }}>
            <Paper sx={{ display: "flex", gap: 2, p: 2, mb: 2 }}>
              <Typography variant="h5">Resume Evaluation</Typography>
              <Rating
                name="half-rating-read"
                defaultValue={parseInt(resume_rank)}
                precision={1}
                readOnly
              />
            </Paper>
            <Typography variant="h6" textAlign="left" color="text.secondary">
              {resume_feedback_conclusion}
            </Typography>
          </Box>
          <Box>
            <Paper sx={{ display: "flex", gap: 2, p: 2, mb: 2 }}>
              <Typography variant="h5">Screening Questions</Typography>
              <Rating
                name="half-rating-read"
                defaultValue={parseInt(screening_rating)}
                precision={1}
                readOnly
              />
            </Paper>
            {resumeScreeningQuestionsAnswers
              ? resumeScreeningQuestionsAnswers.map((x: any) => {
                  return (
                    <Box key={x.question} sx={{ gap: 2, mb: 2 }}>
                      <Typography
                        variant="h6"
                        textAlign="left"
                        color="text.secondary"
                        fontWeight={700}
                      >
                        Q: {x.question}
                      </Typography>
                      <Typography
                        variant="h6"
                        textAlign="left"
                        color="text.secondary"
                      >
                        A: {x.answer}
                      </Typography>
                      <Alert severity="info">{x.answer_feedback}</Alert>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  );
                })
              : null}
          </Box>
        </Box>

        <Typography variant="h3">What you can do to improve ?</Typography>
        <Typography
          variant="h6"
          textAlign="left"
          color="text.secondary"
          sx={{ background: "#ebffeb", p: 1 }}
        >
          {resume_feedback_needsToImprove}
        </Typography>
        <Link href={"/jobs"}>
          <Button variant="contained" color="primary" sx={{ width: "300px" }}>
            Continue
          </Button>
        </Link>
      </Container>
    </Box>
  );
}
