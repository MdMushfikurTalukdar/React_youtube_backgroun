// App.js (React Frontend)
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Download,
  Instagram,
  Facebook,
  YouTube,
  Link as LinkIcon,
  Warning,
  Info,
  Close,
  Lock,
  Code,
  Public,
  CloudDownload
} from '@mui/icons-material';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`platform-tabpanel-${index}`}
      aria-labelledby={`platform-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `platform-tab-${index}`,
    'aria-controls': `platform-tabpanel-${index}`,
  };
}

const DownloadVideo = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Backend API URL - change this to your deployed backend URL
  const API_BASE_URL = 'https://your-python-backend.herokuapp.com';
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setUrl('');
    setVideoInfo(null);
    setError('');
  };

  const handleFetchVideo = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)/;
    if (!urlPattern.test(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Determine platform from URL
      let platform = '';
      if (url.includes('instagram.com')) platform = 'Instagram';
      else if (url.includes('facebook.com')) platform = 'Facebook';
      else if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'YouTube';
      
      if (!platform) {
        throw new Error('Unsupported platform. Please enter a valid Instagram, Facebook, or YouTube URL.');
      }
      
      // Call backend API to fetch video info
      const response = await fetch(`${API_BASE_URL}/api/video-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch video information');
      }
      
      const data = await response.json();
      
      // Set video info
      setVideoInfo({
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        platform,
        qualityOptions: data.qualities || ['720p', '480p', '360p'],
        views: data.views,
        uploadDate: data.upload_date,
        videoUrl: url,
        downloadUrls: data.download_urls // URLs for different qualities
      });
      
      setSnackbarMessage('Video information retrieved successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch video information');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQuality = async (quality) => {
    if (!videoInfo) return;
    
    setDownloading(true);
    setDownloadProgress(0);
    
    try {
      // Call backend to download and store the video
      const response = await fetch(`${API_BASE_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: videoInfo.videoUrl, 
          quality,
          title: videoInfo.title 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download video');
      }
      
      const data = await response.json();
      
      // Show success message with Google Drive link
      setSnackbarMessage(`Video downloaded successfully! It's now available in your Google Drive.`);
      setSnackbarOpen(true);
      
      // Open Google Drive link in new tab
      window.open(data.drive_link, '_blank');
      
    } catch (err) {
      setError(err.message || 'Failed to download video');
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Social Media Video Downloader
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Download videos from Instagram, Facebook, and YouTube to Google Drive
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="platform tabs"
            variant={isMobile ? "fullWidth" : "standard"}
            centered
          >
            <Tab icon={<Instagram color="secondary" />} label={isMobile ? null : "Instagram"} {...a11yProps(0)} />
            <Tab icon={<Facebook color="primary" />} label={isMobile ? null : "Facebook"} {...a11yProps(1)} />
            <Tab icon={<YouTube color="error" />} label={isMobile ? null : "YouTube"} {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <PlatformInstructions 
            platform="Instagram"
            instructions="Paste the URL of an Instagram post or reel in the field below"
            exampleUrl="https://www.instagram.com/p/C..."
            icon={<Instagram color="secondary" />}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <PlatformInstructions 
            platform="Facebook"
            instructions="Paste the URL of a Facebook video in the field below"
            exampleUrl="https://www.facebook.com/watch?v=..."
            icon={<Facebook color="primary" />}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <PlatformInstructions 
            platform="YouTube"
            instructions="Paste the URL of a YouTube video or short in the field below"
            exampleUrl="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            icon={<YouTube color="error" />}
          />
        </TabPanel>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Paste video URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            InputProps={{
              startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleFetchVideo}
            disabled={loading}
            sx={{ 
              minWidth: { xs: '100%', sm: '140px' },
              py: 1.5
            }}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Fetching...' : 'Fetch Video'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <Alert severity="info" icon={<Info />}>
            <Typography variant="body2">
              Videos will be downloaded to your connected Google Drive account
            </Typography>
          </Alert>
        </Box>
      </Paper>

      {videoInfo && (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom color="primary">
            Video Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={videoInfo.thumbnail}
                  alt={videoInfo.title}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {videoInfo.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    <Chip icon={tabValue === 0 ? <Instagram /> : tabValue === 1 ? <Facebook /> : <YouTube />} 
                          label={videoInfo.platform} size="small" variant="outlined" />
                    <Chip label={videoInfo.duration} size="small" variant="outlined" />
                    <Chip label={videoInfo.views} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded: {videoInfo.uploadDate}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Available Qualities
              </Typography>
              
              <Grid container spacing={2}>
                {videoInfo.qualityOptions.map((quality, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CloudDownload />}
                      onClick={() => handleDownloadQuality(quality)}
                      sx={{ py: 1.5 }}
                      disabled={downloading}
                    >
                      {quality}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              
              {downloading && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Downloading to Google Drive... {Math.round(downloadProgress)}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={downloadProgress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
      
      <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          How It Works
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CloudDownload color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Download to Google Drive" 
              secondary="Videos are downloaded directly to your Google Drive storage" 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Lock color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Secure Process" 
              secondary="Your videos are processed securely through our backend" 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Public color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Access Anywhere" 
              secondary="Downloaded videos are accessible from any device with Google Drive" 
            />
          </ListItem>
        </List>
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            <Close />
          </Button>
        }
      />
    </Container>
  );
};

// Component for platform-specific instructions
const PlatformInstructions = ({ platform, instructions, exampleUrl, icon }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {platform} Downloader
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        {instructions}
      </Typography>
      <Typography variant="caption" display="block" color="text.secondary" fontFamily="monospace">
        Example: {exampleUrl}
      </Typography>
    </Box>
  );
};

export default DownloadVideo;