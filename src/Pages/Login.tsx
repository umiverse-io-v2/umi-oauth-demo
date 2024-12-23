import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { blue } from '@mui/material/colors';

const umiApiKey= process.env.REACT_APP_UMI_API_KEY || 'your-apit-key';
const umiApiSecret= process.env.REACT_APP_UMI_API_SECRET || 'your-secret-key';
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

const Login: React.FC = () => {
  const handleOauthLogin = () => {
    const umiverseAuthUrl = `https://umiverse.io/login?redirect=${REDIRECT_URI}&apikey=${umiApiKey}`;
    window.location.href = umiverseAuthUrl;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ backgroundColor: 'black', color: 'white' }} // 黑色背景，白色字体
    >
      {/* 游戏标题 */}
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        Your Game Name
      </Typography>

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