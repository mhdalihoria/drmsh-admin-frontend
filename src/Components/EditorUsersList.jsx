import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import useAuthStore from '../store/useAuthStore';

const EditorUsersList = () => {
  const [users, setUsers] = useState([]);
  const token = useAuthStore((state) => state.token);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const promote = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/auth/users/promote/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error('Promotion failed:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Editor Users</Typography>
      <Stack spacing={2}>
        {users.map((user) => (
          <Paper key={user._id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{user.email}</Typography>
            <Button variant="outlined" onClick={() => promote(user._id)}>Promote to Admin</Button>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default EditorUsersList;