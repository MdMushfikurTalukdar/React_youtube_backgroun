import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'error', message: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert Google Sheets URL to JSON endpoint
      const sheetId = '1B4d7a3-fZZuiiET-WBvdqBbee-VoSQpTE_a_602Bd18';
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
      
      const response = await fetch(url);
      const text = await response.text();
      
      // Extract JSON from the response (it's wrapped in a special format)
      const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonText);
      
      // Process the rows from the sheet
      const rows = data.table.rows;
      const users = rows.slice(1).map(row => { // Skip header row
        const cells = row.c;
        return {
          email: cells[0]?.v || '', // First column - email
          name: cells[1]?.v || '',  // Second column - name
          age: cells[2]?.v || '',   // Third column - age
          gender: cells[3]?.v || '', // Fourth column - gender
          password: cells[4]?.v || '', // Fifth column - password
          registrationDate: cells[5]?.v || '' // Sixth column - registration date
        };
      });
      
      // Check if credentials match
      const user = users.find(user => 
        user.email === formData.email && user.password === formData.password
      );
      
      if (user) {
        setAlert({
          open: true,
          severity: 'success',
          message: `Login successful! Welcome back, ${user.name}!`
        });
        setIsLoggedIn(true);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setAlert({
          open: true,
          severity: 'error',
          message: 'Invalid email or password. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      setAlert({
        open: true,
        severity: 'error',
        message: 'An error occurred during authentication. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFormData({ email: '', password: '' });
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setAlert({
      open: true,
      severity: 'info',
      message: 'You have been logged out successfully.'
    });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 8, background: 'linear-gradient(to bottom, #f5f7fa, #c3cfe2)' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          {isLoggedIn ? 'Welcome!' : 'Welcome Back'}
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3 }}>
          {isLoggedIn ? 'You are successfully logged in' : 'Sign in to your account'}
        </Typography>
        
        {alert.open && (
          <Alert severity={alert.severity} sx={{ mb: 2 }} onClose={() => setAlert({...alert, open: false})}>
            {alert.message}
          </Alert>
        )}
        
        {isLoggedIn ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Authentication Successful!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Log Out
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              sx={{ mb: 2 }}
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
              sx={{ mb: 3 }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2">
                Don't have an account? <a href="#" style={{ textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</a>
              </Typography>
            </Box>
            
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;