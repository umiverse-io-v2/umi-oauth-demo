import React from 'react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>UMMIVERSE Oauth DEMO</h1>
      <Link to="/login">Login Demo</Link>
    </div>
  );
};

export default Index;
