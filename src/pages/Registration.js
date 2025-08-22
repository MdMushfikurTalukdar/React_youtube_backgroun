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
  DialogActions,
  Fade,
  Zoom,
  Avatar,
  CssBaseline
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Help,
  PersonAdd,
  Lock
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#6573c3',
      dark: '#2c387e'
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

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
    { value: 'female', label: 'Female' }
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
      
      // Try to parse the response
      let result;
      try {
        result = await response.json();
      } catch (e) {
        // If JSON parsing fails, try text
        const textResult = await response.text();
        console.log("Response text:", textResult);
        
        // // Try to parse as JSON again if it looks like JSON
        // if (textResult.trim().startsWith('{') || textResult.trim().startsWith('[')) {
        //   try {
        //     result = JSON.parse(textResult);
        //   } catch (parseError) {
        //     throw new Error('Invalid response from server');
        //   }
        // } else {
        //   throw new Error('Registration failed. Please try again.');
        // }
      }
      
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
      console.error('Registration error:', error);
      setAlert({
        open: true,
        message: error.message || 'An error occurred during registration. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={8} 
            sx={{ 
              p: 4, 
              mt: 4, 
              background: 'linear-gradient(to bottom, #ffffff, #f5f7fa)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <PersonAdd sx={{ fontSize: 30 }} />
              </Avatar>
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Typography variant="h4" component="h1" color="primary" gutterBottom>
                  Create Account
                </Typography>
                <IconButton 
                  onClick={() => setHelpOpen(true)} 
                  color="primary"
                  sx={{ 
                    backgroundColor: 'primary.light', 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  <Help />
                </IconButton>
              </Box>
            </Box>
            
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
              Join us to access all features
            </Typography>
            
            {alert.open && (
              <Zoom in={alert.open}>
                <Alert 
                  severity={alert.severity} 
                  sx={{ mb: 2 }} 
                  onClose={() => setAlert({...alert, open: false})}
                  variant="filled"
                >
                  {alert.message}
                </Alert>
              </Zoom>
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
                    autoComplete="name"
                    autoFocus
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
                    autoComplete="email"
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
                    inputProps={{ min: 1, max: 120 }}
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
                    autoComplete="new-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
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
                    autoComplete="new-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
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
                    sx={{ 
                      mt: 2, 
                      py: 1.5, 
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Create Account'}
                  </Button>
                </Grid>
                
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      style={{ 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        color: theme.palette.primary.main
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Fade>

        <Dialog 
          open={helpOpen} 
          onClose={() => setHelpOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold' }}>Registration Help</DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              If you're experiencing issues with registration feedback:
            </Typography>
            <ul>
              <li>The data is being saved to Google Sheets successfully</li>
              <li>You may not see a success message due to technical limitations</li>
              <li>After submitting the form, try navigating to the login page manually</li>
              <li>Check your Google Sheets to confirm your registration was saved</li>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setHelpOpen(false)}
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default Registration;