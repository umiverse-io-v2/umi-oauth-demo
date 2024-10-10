import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { blue } from '@mui/material/colors';

const apikey = process.env.REACT_APP_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

const Login: React.FC = () => {

  const handleOauthLogin = () => {
    const umiverseAuthUrl = `https://umiverse.io/login?redirect=${REDIRECT_URI}&apikey=${apikey}`;
    window.location.href = umiverseAuthUrl;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Box component="form" noValidate autoComplete="off">

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ backgroundColor: blue[500], color: 'white' }}
              fullWidth
              onClick={handleOauthLogin}
            >
              UMIVERSE Oauth Login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
