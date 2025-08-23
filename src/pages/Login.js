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
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'error', message: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Function to generate a secure token
  const generateSecureToken = () => {
    // Generate a random token using browser's crypto API if available
    const randomBytes = new Uint8Array(32);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(randomBytes);
    } else {
      // Fallback for older browsers
      for (let i = 0; i < randomBytes.length; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
      }
    }
    
    // Convert to hex string
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      
      // Extract JSON from the response
      const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonText);
      
      // Process the rows from the sheet
      const rows = data.table.rows;
      const users = rows.slice(1).map(row => {
        const cells = row.c;
        return {
          email: cells[0]?.v || '',
          name: cells[1]?.v || '',
          age: cells[2]?.v || '',
          gender: cells[3]?.v || '',
          password: cells[4]?.v || '',
          registrationDate: cells[5]?.v || ''
        };
      });
      
      // Check if credentials match
      const user = users.find(user => 
        user.email === formData.email && user.password === formData.password
      );
      
      if (user) {
        // Generate secure token
        const authToken = generateSecureToken();
        
        // Store token in localStorage
        localStorage.setItem('authToken', authToken);
        // Also store token expiration (24 hours from now)
        const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiration', expirationTime);
        
        setAlert({
          open: true,
          severity: 'success',
          message: `Login successful! Welcome back, ${user.name}!`
        });
        
        // Use the auth context to log in (pass the token)
        login(user, authToken);
        
        // Redirect to chat page after a short delay
        setTimeout(() => {
          navigate('/auto');
        }, 1500);
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

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 8, background: 'linear-gradient(to bottom, #f5f7fa, #c3cfe2)' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Welcome Back
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3 }}>
          Sign in to your account
        </Typography>
        
        {alert.open && (
          <Alert severity={alert.severity} sx={{ mb: 2 }} onClose={() => setAlert({...alert, open: false})}>
            {alert.message}
          </Alert>
        )}
        
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
              Don't have an account? <Link to="/register" style={{ textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;