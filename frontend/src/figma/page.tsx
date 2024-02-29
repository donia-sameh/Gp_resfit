"use client";

import * as React from "react";
import homeImage from "/public/homeImage.png";
import Image from "next/image";
import Header from "@/component/header";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import homeImage2 from "/public/homeImage2.png";
import headIdea from "/public/headIdea.png";

import Footer from "@/component/footerr";

function Home() {
  const style3 = {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-80px",
  };
  return (
    <div>
      <Header />
      <Image
        src={homeImage}
        alt="home image not found"
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <Typography
        variant="h6"
        noWrap
        component="a"
        sx={{
          mr: 2,
          display: { xs: "none", md: "inline-block" },
          fontFamily: "roboto",
          fontWeight: 700,
          fontSize: 40,
          color: "#133F64",
          textDecoration: "none",
          marginLeft: "60px",
          marginTop: "30px",
          //float: 'right',
        }}
      >
        Streamline your hiring process
        <br />
        with automated CV parsing
      </Typography>
      <Typography
        variant="h6"
        noWrap
        component="a"
        sx={{
          mr: 2,
          display: { xs: "none", md: "inline-block" },
          fontFamily: "roboto",
          fontWeight: 100,
          fontSize: 20,
          color: "#133F64",
          textDecoration: "none",
          float: "right",
          marginTop: "30px",
        }}
      >
        Our system simplifies the evaluation and ranking of candidates.
      </Typography>

      <div style={style3}>
        <Button
          variant="contained"
          href="/auth/signin"
          sx={{ float: "right", marginRight: "490px" }}
        >
          Start Now
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "100px",
          marginLeft: "60px",
        }}
      >
        <Image
          src={homeImage2}
          alt="home image not found"
          width={680}
          height={439}
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            display: { xs: "none", md: "inline-block" },
            fontFamily: "roboto",
            fontWeight: 700,
            fontSize: 40,
            color: "#133F64",
            textDecoration: "none",
            marginLeft: "60px",
            marginTop: "30px",
          }}
        >
          Advanced Algorithms for CV Parsing
        </Typography>
      </div>
      <Typography
        variant="h6"
        noWrap
        component="a"
        sx={{
          fontFamily: "roboto",
          fontWeight: 100,
          fontSize: 20,
          color: "#133F64",
          textDecoration: "none",
          float: "right",
          marginTop: "-300px",
        }}
      >
        Our automated system utilizes advanced algorithms to parse CVs,
        <br /> enabling efficient evaluation and ranking of candidates.
      </Typography>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "100px",
          marginLeft: "60px",
          gap:'60px'
        }}
      > 
      <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
    justifyContent: "center",
        }}>
        <Image
          src={headIdea}
          alt="home image not found"
          width={43}
          height={43}
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            display: { xs: "none", md: "inline-block" },
            fontFamily: "roboto",
            fontWeight: 700,
            fontSize: 30,
            color: "#133F64",
            textDecoration: "none",
            marginTop: "10px",
          }}
        >
          How to Use Our System
        </Typography>
        
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            fontFamily: "roboto",
            fontWeight: 100,
            fontSize: 20,
            color: "#133F64",
            textDecoration: "none",
            float: "right",
          }}
        >
          Step 1: Create an account
        </Typography>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
    justifyContent: "center",
        }}>
        <Image
          src={headIdea}
          alt="home image not found"
          width={43}
          height={43}
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            display: { xs: "none", md: "inline-block" },
            fontFamily: "roboto",
            fontWeight: 700,
            fontSize: 30,
            color: "#133F64",
            textDecoration: "none",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        >
        Step 2: Post your CV
        </Typography>
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            fontFamily: "roboto",
            fontWeight: 100,
            fontSize: 20,
            color: "#133F64",
            textDecoration: "none",
            float: "right",
          }}
        >
          Step 3: System rates CV
        </Typography>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
    justifyContent: "center",
        }}>
        <Image
          src={headIdea}
          alt="home image not found"
          width={43}
          height={43}
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            display: { xs: "none", md: "inline-block" },
            fontFamily: "roboto",
            fontWeight: 700,
            fontSize: 30,
            color: "#133F64",
            textDecoration: "none",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        >
       Step 4: Answer screening questions
        </Typography>
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            fontFamily: "roboto",
            fontWeight: 100,
            fontSize: 20,
            color: "#133F64",
            textDecoration: "none",
            float: "right",
          }}
        >
         Step 5: Validate screening questions
        </Typography>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
    justifyContent: "center",
        }}>
        <Image
          src={headIdea}
          alt="home image not found"
          width={43}
          height={43}
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            display: { xs: "none", md: "inline-block" },
            fontFamily: "roboto",
            fontWeight: 700,
            fontSize: 30,
            color: "#133F64",
            textDecoration: "none",
         marginLeft: "10px",
            marginTop: "10px",
          }}
        >
Step 5: Final ranking
        </Typography>
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            fontFamily: "roboto",
            fontWeight: 100,
            fontSize: 20,
            color: "#133F64",
            textDecoration: "none",
            float: "right",
          }}
        >
Step 6: Expert validation
        </Typography>
        </div>
      </div>
      <Button
          variant="contained"
          href="/auth/signin"
          sx={{marginTop: "10px",marginLeft:"180px" }}
        >
          Sign up
        </Button>
        
        <Footer />
    </div>
  
  );
}
export default Home;
