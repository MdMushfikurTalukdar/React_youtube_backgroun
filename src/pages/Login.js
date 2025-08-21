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

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'error' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
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
    
    if (!validateForm()) return;
    
    setLoading(true);
    setAlert({ open: false, message: '', severity: 'error' });
    
    try {
      // Your Google Apps Script deployment URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxiZL5Gzfvbcnp1tUpIklLh2e94N5JJ9IafGsPCqEwevo15PGWnyILPTPTN-Mo6ovRm/exec';
      
      // Create URL encoded form data
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('action', 'login');
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('password', formData.password);
      
      // Use a proxy to bypass CORS issues in development
      const useCorsProxy = process.env.NODE_ENV === 'development';
      const url = useCorsProxy 
        ? `https://cors-anywhere.herokuapp.com/${scriptURL}`
        : scriptURL;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString()
      });
      
      // Parse the response
      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Invalid response format from server');
      }
      
      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        setAlert({
          open: true,
          message: 'Login successful! Redirecting...',
          severity: 'success'
        });
        
        // Redirect to homepage after 1 second
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setAlert({
          open: true,
          message: result.message || 'Invalid email or password',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlert({
        open: true,
        message: 'Login service is temporarily unavailable. Please try again later.',
        severity: 'error'
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