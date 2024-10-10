import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { decrypt } from '../utils/AES';

const secretKey = process.env.REACT_APP_API_SECRET || 'your-secret-key'; // Get the key from the environment variable
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

  // Function to get user information
  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch(`${apiHost}/user/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // use Bearer Token
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        setUserInfo(result.data); // Saving User Data
      } else {
        setError(result.message || 'Failed to fetch user info');
      }
    } catch (err) {
      setError('Error fetching user info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorizationCode) {
      try {
        // Decrypt authorizationCode and get idToken
        const decryptedData = decrypt(authorizationCode, secretKey);
        setIdToken(decryptedData);

        // Get user information
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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login successful, welcome to our website!</h1>
      {idToken && <p>Your idToken is: {idToken}</p>}

      {userInfo ? (
        <div>
          <h2>User Info</h2>
          <p><strong>ID:</strong> {userInfo.id}</p>
          <p><strong>Create Time:</strong> {userInfo.create_time}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Picture:</strong> <img style={{width:'30px'}} src={userInfo.picture} alt="User Avatar" /></p>
          <p><strong>User Name:</strong> {userInfo.user_name}</p>
          <p><strong>Wallet Address:</strong> {userInfo.wallet_address}</p>
          <p><strong>Login Method:</strong> {userInfo.loginMethod}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default LoginSuccess;
