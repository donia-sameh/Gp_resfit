"use client";
import { PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import { AppBar as MUIAppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "./ToggleColorMode";
import BusinessCenterTwoToneIcon from "@mui/icons-material/BusinessCenterTwoTone";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

function AppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = useState(false);
  const { data } = useSession();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  const isLoggedIn = !!data?.accessToken;

  return (
    <div>
      <MUIAppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                px: 0,
              }}
            >
              <Link href="/">
                <Button>
                  <BusinessCenterTwoToneIcon
                    sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      mr: 2,
                      display: { xs: "none", md: "flex" },
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".3rem",
                      textDecoration: "none",
                    }}
                  >
                    ResuFit
                  </Typography>
                </Button>
              </Link>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {isLoggedIn ? (
                <>
                  <Typography>{data.user?.name}</Typography>
                  <Button onClick={() => signOut()}>Logout</Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button color="primary" variant="text" size="small">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button color="primary" variant="contained" size="small">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode
                      mode={mode}
                      toggleColorMode={toggleColorMode}
                    />
                  </Box>
                  <MenuItem onClick={() => scrollToSection("features")}>
                    Features
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("testimonials")}>
                    Testimonials
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("highlights")}>
                    Highlights
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("pricing")}>
                    Pricing
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("faq")}>
                    FAQ
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <Link href="/auth/signin">
                      <Button color="primary" variant="text" size="small">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button color="primary" variant="contained" size="small">
                        Sign up
                      </Button>
                    </Link>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </MUIAppBar>
    </div>
  );
}

export default AppBar;
