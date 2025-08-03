
import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import useAuthStore from '../../store/useAuthStore';

const AuthForm = ({ mode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${mode}`, { email, password });
      if (mode === 'login') {
        login(res.data.token, res.data.role);
        setMessage('Login successful');
        navigate('/dashboard');
      } else {
        setMessage('Signup successful');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">{mode === 'login' ? 'Login' : 'Signup'}</Typography>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ my: 2 }} />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <Button variant="contained" onClick={handleSubmit}>{mode === 'login' ? 'Login' : 'Signup'}</Button>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default AuthForm;