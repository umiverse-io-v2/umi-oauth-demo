import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { decrypt } from '../utils/AES';
import { Box, Button, Typography } from '@mui/material';

const secretKey = process.env.REACT_APP_API_SECRET || 'your-secret-key';
const apiHost = process.env.REACT_APP_API_HOST || 'umiverse-api-host';

interface UserInfo {
  id: number;
  create_time: string;
  email: string;
  picture: string;
  user_name: string;
  wallet_address: string;
  loginMethod: string;
}

const LoginSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const authorizationCode = queryParams.get('authorizationCode');
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string>(''); // 保存API调用返回信息

  // 获取用户信息
  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch(`${apiHost}/user/info`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        setUserInfo(result.data);
        setApiResponse(JSON.stringify(result.data, null, 2));
      } else {
        setError(result.message || 'Failed to fetch user info');
      }
    } catch (err) {
      setError('Error fetching user info');
    } finally {
      setLoading(false);
    }
  };

  // 增加 DivePoints 方法
  const addDivePoints = async (token: string) => {
    try {
      const response = await fetch(`${apiHost}/user/dive-points`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points: 10 }), // 示例请求体
      });

      const result = await response.json();
      if (response.ok) {
        setApiResponse(`DivePoints updated successfully: ${JSON.stringify(result, null, 2)}`);
      } else {
        setError(result.message || 'Failed to add DivePoints');
      }
    } catch (err) {
      setError('Error adding DivePoints');
    }
  };

  useEffect(() => {
    if (authorizationCode) {
      try {
        const decryptedData = decrypt(authorizationCode, secretKey);
        setIdToken(decryptedData);
        fetchUserInfo(decryptedData);
      } catch (error) {
        console.error('Error decrypting authorizationCode:', error);
        setError('Error decrypting authorizationCode');
        setLoading(false);
      }
    }
  }, [authorizationCode, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h4" gutterBottom>
        Login successful, welcome to our website!
      </Typography>

      {userInfo ? (
        <Box>
          <Typography variant="h6">User Info</Typography>
          <Typography><strong>ID:</strong> {userInfo.id}</Typography>
          <Typography><strong>Email:</strong> {userInfo.email}</Typography>
        </Box>
      ) : (
        <Typography>No user data available</Typography>
      )}

      {/* Back Home Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ mt: 3 }}
      >
        Back Home
      </Button>

      {/* API列表 */}
      <Box mt={5}>
        <Typography variant="h5">API List (Developer Demo)</Typography>
        <Box mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => fetchUserInfo(idToken!)}
            sx={{ m: 1 }}
          >
            1. Fetch User Info
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => addDivePoints(idToken!)}
            sx={{ m: 1 }}
          >
            2. Add DivePoints
          </Button>
        </Box>
        {/* 返回内容 */}
        <Box
          mt={3}
          p={2}
          border="1px solid #ccc"
          borderRadius="8px"
          bgcolor="#f9f9f9"
          textAlign="left"
        >
          <Typography variant="h6">API Response:</Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {apiResponse || 'No response yet'}
          </pre>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginSuccess;