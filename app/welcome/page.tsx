import React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import "@/app/styles.css";


export default function Hero() {
  const router = useRouter(); 
  
  
  const handleGetStartedClick = () => {
    router.push('/home');
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          backgroundImage: 'url(/hero.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            className={"theme-dark"}
            sx={{ fontSize: '5rem', marginBottom: '1rem' }}
          >
            Welcome to Pantry "R" Us
          </Typography>
          <Typography
            variant="h3"
            component="h3"
            className={"theme-dark"}
            sx={{ fontSize: '2rem', marginBottom: '2rem' }}
          >
            Inventory Management Made Easy.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={handleGetStartedClick} // Attach the click handler here
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
