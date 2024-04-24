import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { JobVacancy } from "@/constants/JobVacancy";
import Link from "next/link";

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export default function JobVacancyCard({
  id,
  title,
  jobDescription,
}: JobVacancy) {
  const truncatedDescription = truncateText(jobDescription, 250);

  return (
    <Card key={id}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5, minHeight: 100 }} color="text.secondary">
          {truncatedDescription}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`/jobs/${id}/apply`}>
          <Button size="small">Apply Now</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
