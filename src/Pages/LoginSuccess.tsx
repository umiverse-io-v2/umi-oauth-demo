import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { decrypt } from '../utils/AES';
import { MD5 } from 'crypto-js';

const merchantId = process.env.REACT_APP_MERCHANT_ID || 'your-merchant-id';
const umiApiKey = process.env.REACT_APP_UMI_API_KEY || 'your-apit-key';
const umiApiSecret = process.env.REACT_APP_UMI_API_SECRET || 'your-secret-key';
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

  // 签名生成函数
  const createSignature = (key: string, params: any, ts: number): string => {
    let str = '';
    for (const paramKey in params) {
      if (params.hasOwnProperty(paramKey)) {
        const value = params[paramKey];
        str += `${value}`;
      }
    }
    str += `${ts}${key}`;
    return MD5(str).toString();
  };

  // 获取用户信息接口调用
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
        setApiResponse(`User Info fetched successfully: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        setApiResponse(`Failed to fetch user info: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setApiResponse(`Error fetching user info: ${err.message}`);
      } else {
        setApiResponse('Error fetching user info: Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  // 增加 DivePoints 的方法
  const addDivePoints = async () => {
    if (!userInfo) {
      setApiResponse('User information is not available.');
      return;
    }

    const params = {
      merchantId: merchantId, // 示例 merchantId
      action: 'daily_quest_1',
      user: userInfo.id.toString(),
      amount: 6,
      limitTotal: 0,
      limitDay: 100,
      description: 'Daily Quest 1',
    };

    const ts = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
    const signature = createSignature(umiApiKey, params, ts);

    try {
      const response = await fetch(`${apiHost}/quest/divepoint/inc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          ts,
          sign: signature,
          extraParams: JSON.stringify({ action: 'daily_quest' }), // 示例额外参数
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setApiResponse(`DivePoints added successfully: ${JSON.stringify(result, null, 2)}`);
      } else {
        setApiResponse(`Failed to add DivePoints: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setApiResponse(`Error adding DivePoints: ${err.message}`);
      } else {
        setApiResponse('Error adding DivePoints: Unknown error');
      }
    }
  };

  useEffect(() => {
    if (authorizationCode) {
      try {
        const decryptedData = decrypt(authorizationCode, umiApiSecret);
        setIdToken(decryptedData);
        // 调用获取用户信息的接口
        fetchUserInfo(decryptedData);
      } catch (error) {
        console.error('Error decrypting authorizationCode:', error);
        setError('Error decrypting authorizationCode');
        setLoading(false);
      }
    }
  }, [authorizationCode]);

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

      {/* API 列表 */}
      <Box mt={5}>
        <Typography variant="h5">Developer Demo: API List</Typography>
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
            onClick={addDivePoints}
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