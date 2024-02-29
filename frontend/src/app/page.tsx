"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Hero from "../component/Hero";
import Highlights from "../component/Highlights";
import Features from "../component/Features";
import { useSession } from "next-auth/react";
import { UserRoles } from "@/constants/UserRoles";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { data } = useSession()
  const router = useRouter();

  if(data?.role === UserRoles.ADMIN) {
    router.push("/dashboard")
    return <></>;
  }

  return (
    <>
      <Hero />
      <Box sx={{ bgcolor: "background.default" }}>
        <Features />
        <Divider />
        <Highlights />
        <Divider />
      </Box>
    </>
  );
}
