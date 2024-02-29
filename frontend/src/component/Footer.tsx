import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone';

import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const logoStyle = {
  width: '140px',
  height: 'auto',
};



export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <Box sx={{ ml: '-15px' , flexDirection:'row'}}>
              <div style={{display: 'flex',flexDirection:'row', marginBottom:'20px'}}>
                <BusinessCenterTwoToneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}/>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
              marginTop:'3px'
            }}
          >
            ResuFit
          </Typography></div>
           
            </Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              123  Street, New Cairo, Egypt
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Email: info@resufit.com
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Phone: +1 234 567 8901
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Product
          </Typography>
          <Link color="text.secondary" href="#">
            Features
          </Link>
          <Link color="text.secondary" href="#">
            Highlights
          </Link>
   
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Company
          </Typography>
          <Link color="text.secondary" href="#">
            About us
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <Link color="text.secondary" href="#">
            Privacy Policy
          </Link>
          <Typography display="inline" sx={{ mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" href="#">
            Terms of Service
          </Link>
        </div>
        <Stack
          direction="row"
          justifyContent="left"
          spacing={1}
          useFlexGap
          sx={{
            color: 'text.secondary',
          }}
        >
          <IconButton
            color="inherit"
            href="https://www.facebook.com/" 
            aria-label="GitHub"
            sx={{ alignSelf: 'center' }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            color="inherit"
            href="https://www.twitter.com/"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <Twitter />
          </IconButton>
          <IconButton
            color="inherit"
            href="https://www.instagram.com/"
            aria-label="LinkedIn"
            sx={{ alignSelf: 'center' }}
          >
            <Instagram />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}