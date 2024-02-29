"use client";

import getLPTheme from "@/app/getLPTheme";
import { Box, CssBaseline, PaletteMode } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FC, PropsWithChildren, useMemo, useState, useEffect } from "react";
import AppBar from "../component/AppBar";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserRoles } from "@/constants/UserRoles";
import Footer from "./Footer";

export const ThemeManager: FC<PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const defaultTheme = createTheme({});
  const LPtheme = createTheme(getLPTheme(mode));
  const router = useRouter();
  const { data } = useSession();

//   useEffect(() => {
//     if (data) {
//       if (data.role === UserRoles.ADMIN) {
//         router.push("/dashboard");
//       } else if (data.role === UserRoles.APPLICANT) {
//         router.push("/job-opening");
//       }
//     }
//   }, [data]);

  const pathname = usePathname();

  const showAppBar = useMemo(
    () => !["/auth/signin", ""].includes(pathname),
    [pathname]
  );

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      {showAppBar && <AppBar mode={mode} toggleColorMode={toggleColorMode} />}
      <Box
        sx={{
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        {children}
      </Box>
      <Footer />
    </ThemeProvider>
  );
};
