"use client";

import { JobVacancy } from "@/constants/JobVacancy";
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Jobs from "@/component/admin/Jobs";
import ScreeningQuestions from "@/component/admin/ScreeningQuestions";
import { useSearchParams } from "next/navigation";
import TechSkills from "@/component/admin/TechSkills";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const params = useSearchParams();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    const queryTab = params.get("tab");
    if (!!queryTab) {
      setTab(parseInt(queryTab));
    }
  }, [params]);

  return (
    <Container>
      <Typography variant="h4">Welcome Admin <AdminPanelSettingsIcon sx={{ fontSize: 32 }}/></Typography>
      <Box sx={{ width: "100%", pt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Job" id="tab-1" aria-controls="tab-1" />
            <Tab label="Screening Question" id="tab-2" aria-controls="tab-2" />
            <Tab label="Technical Skill" id="tab-3" aria-controls="tab-3" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          <Jobs />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          <ScreeningQuestions />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={2}>
        <TechSkills/>
        </CustomTabPanel>
      </Box>
    </Container>
  );
}
