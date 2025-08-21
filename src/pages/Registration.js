import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Visibility, VisibilityOff, Help } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'error' });
  const [helpOpen, setHelpOpen] = useState(false);

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ];

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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Your Google Apps Script deployment URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxiZL5Gzfvbcnp1tUpIklLh2e94N5JJ9IafGsPCqEwevo15PGWnyILPTPTN-Mo6ovRm/exec';
      
      // Create URL encoded form data
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('action', 'register');
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('age', formData.age);
      formDataToSubmit.append('gender', formData.gender);
      formDataToSubmit.append('password', formData.password);
      
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString()
      });
      
      // Parse the response
      const result = await response.json();
      
      if (result.success) {
        setAlert({
          open: true,
          message: 'Registration successful! Redirecting to login page...',
          severity: 'success'
        });
        
        // Clear form data
        setFormData({
          name: '',
          email: '',
          age: '',
          gender: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setAlert({
          open: true,
          message: result.message || 'Registration failed. Please try again.',
          severity: 'error'
        });
      }
    } catch (error) {
      navigate('/login');
    } finally {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 4, background: 'linear-gradient(to bottom, #f5f7fa, #c3cfe2)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" color="primary">
            Create Account
          </Typography>
          <IconButton onClick={() => setHelpOpen(true)} color="primary">
            <Help />
          </IconButton>
        </Box>
        <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
          Join us to access all features
        </Typography>
        
        {alert.open && (
          <Alert severity={alert.severity} sx={{ mb: 2 }} onClose={() => setAlert({...alert, open: false})}>
            {alert.message}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
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
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={!!errors.gender}
                helperText={errors.gender}
                required
                variant="outlined"
              >
                {genders.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
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
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            </Grid>
            
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account? <Link to="/login" style={{ textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)}>
        <DialogTitle>Registration Help</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            If you're experiencing issues with registration:
          </Typography>
          <ul>
            <li>Make sure you have a stable internet connection</li>
            <li>Check that all fields are filled out correctly</li>
            <li>Ensure your email address is valid and not already registered</li>
            <li>Try using a different browser if problems persist</li>
          </ul>
          <Typography variant="body2" color="textSecondary">
            After successful registration, you will be automatically redirected to the login page.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Registration;