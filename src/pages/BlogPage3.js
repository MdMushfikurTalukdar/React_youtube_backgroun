import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  styled,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PersonIcon from '@mui/icons-material/Person';

// Styled components
const StyledCard = styled(Card)({
  maxWidth: 345,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
  },
});

const MediaContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '4px',
});

const MediaItem = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000',
});

const StyledImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const PlayButton = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'white',
  fontSize: '4rem',
  opacity: 0.7,
  cursor: 'pointer',
  '&:hover': {
    opacity: 1,
  },
});

const NavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  [theme.breakpoints.down('sm')]: {
    padding: '4px',
    '& svg': {
      fontSize: '1rem',
    }
  },
}));

const PrevButton = styled(NavButton)({
  left: '16px',
});

const NextButton = styled(NavButton)({
  right: '16px',
});

const MediaCounter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.875rem',
  boxShadow: theme.shadows[1],
}));

const MediaTypeIndicator = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: '16px',
  right: '16px',
  backgroundColor: theme.palette.background.paper,
}));

const LikeDislikeContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  borderTop: '1px solid #e0e0e0',
});

const ActionButton = styled(Button)(({ theme, active }) => ({
  minWidth: 'auto',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const WriterInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginTop: '8px',
  padding: '8px 0',
});

const BlogDetailDialog = ({ blog, open, onClose, onLike, onDislike, userReactions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Reset currentIndex when blog changes
  useEffect(() => {
    setCurrentIndex(0);
    setPlayingVideo(false);
  }, [blog]);

  const handleNext = () => {
    setPlayingVideo(false);
    setCurrentIndex(prev => 
      prev === blog.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setPlayingVideo(false);
    setCurrentIndex(prev => 
      prev === 0 ? blog.images.length - 1 : prev - 1
    );
  };

  const handlePlayVideo = () => {
    setPlayingVideo(true);
  };

  const getDirectImageUrl = (url) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1] || 
                    url.match(/id=([^&]+)/)?.[1] || 
                    url.split('/').slice(-1)[0];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };

  const getVideoUrl = (url) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1] || 
                    url.match(/id=([^&]+)/)?.[1] || 
                    url.split('/').slice(-1)[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  const isVideo = (url) => {
    if (!url) return false;
    return url.includes('drive.google.com');
  };

  const getThumbnailForVideo = (url) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1] || 
                    url.match(/id=([^&]+)/)?.[1] || 
                    url.split('/').slice(-1)[0];
      return `https://img.youtube.com/vi/${fileId}/hqdefault.jpg`;
    }
    return 'https://i.imgur.com/zvWTUVu.jpg';
  };

  if (!blog) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {blog.title || 'Untitled Blog'}
        {blog.category && (
          <Box mt={1}>
            <Chip 
              label={blog.category} 
              size="small" 
              color="primary"
            />
          </Box>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {blog.images?.length > 0 && (
          <MediaContainer 
            sx={{ 
              height: isMobile ? '250px' : '400px',
              mb: 3
            }}
          >
            <MediaItem sx={{ height: isMobile ? '250px' : '400px' }}>
              {isVideo(blog.images[currentIndex]) ? (
                <>
                  {playingVideo ? (
                    <iframe
                      src={getVideoUrl(blog.images[currentIndex])}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="autoplay"
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <>
                      <StyledImage
                        src={getThumbnailForVideo(blog.images[currentIndex])}
                        alt="Video thumbnail"
                        style={{ opacity: 0.7 }}
                      />
                      <PlayButton onClick={handlePlayVideo}>
                        <PlayCircleOutline fontSize="inherit" />
                      </PlayButton>
                    </>
                  )}
                  <MediaTypeIndicator 
                    label="Video" 
                    color="secondary" 
                    size="small"
                  />
                </>
              ) : (
                <>
                  <StyledImage
                    src={getDirectImageUrl(blog.images[currentIndex])}
                    alt={`${blog.title || 'Blog'} image ${currentIndex + 1}`}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/500?text=Image+Not+Found';
                    }}
                  />
                  <MediaTypeIndicator 
                    label="Image" 
                    color="primary" 
                    size="small"
                  />
                </>
              )}
            </MediaItem>
            
            {blog.images.length > 1 && (
              <>
                <PrevButton onClick={handlePrev} size={isMobile ? 'small' : 'medium'}>
                  <ChevronLeft fontSize={isMobile ? 'small' : 'medium'} />
                </PrevButton>
                <NextButton onClick={handleNext} size={isMobile ? 'small' : 'medium'}>
                  <ChevronRight fontSize={isMobile ? 'small' : 'medium'} />
                </NextButton>
                <MediaCounter>
                  {currentIndex + 1} / {blog.images.length}
                </MediaCounter>
              </>
            )}
          </MediaContainer>
        )}
        
        {/* Writer Information */}
        {blog.writer && (
          <WriterInfo>
            <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              Written by: {blog.writer}
            </Typography>
          </WriterInfo>
        )}
        
        <Typography 
          variant="body1" 
          paragraph
          sx={{ whiteSpace: 'pre-line', mt: 2 }}
        >
          {blog.content || 'No content available'}
        </Typography>
      </DialogContent>
      
      {/* Like/Dislike Section */}
      <LikeDislikeContainer>
        <Box>
          <ActionButton 
            startIcon={<ThumbUpIcon />}
            onClick={() => onLike(blog.id)}
            active={userReactions[blog.id] === 'like'}
          >
            {blog.like || 0}
          </ActionButton>
          <ActionButton 
            startIcon={<ThumbDownIcon />}
            onClick={() => onDislike(blog.id)}
            active={userReactions[blog.id] === 'dislike'}
            sx={{ ml: 1 }}
          >
            {blog.dislike || 0}
          </ActionButton>
        </Box>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </LikeDislikeContainer>
    </Dialog>
  );
};

const BlogPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReactions, setUserReactions] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch data from Google Sheets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sheetId = '1jy58BhhGVzqO7AVENfxwjfWtJQMkpmif0JtbaYZhIdU';
        const response = await fetch(
          `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const text = await response.text();
        const jsonText = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/)[1];
        const data = JSON.parse(jsonText);
        
        const rows = data.table.rows;
        const formattedData = rows.map(row => {
          const obj = {};
          data.table.cols.forEach((col, index) => {
            if (col.label) {
              const key = col.label.toLowerCase().replace(/\s+/g, '');
              if (key === 'images' && row.c[index]?.v) {
                const cleanValue = row.c[index].v.toString().replace(/[()"]/g, '');
                obj[key] = cleanValue.split(',').map(url => url.trim()).filter(url => url);
              } else if ((key === 'like' || key === 'dislike') && row.c[index]?.v) {
                // Parse like and dislike counts as numbers
                obj[key] = parseInt(row.c[index].v) || 0;
              } else {
                // Preserve newlines in content
                obj[key] = row.c[index]?.v ? row.c[index].v.toString() : '';
              }
            }
          });
          return obj;
        });
        
        setBlogData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load user reactions from localStorage
  useEffect(() => {
    const savedReactions = localStorage.getItem('blogReactions');
    if (savedReactions) {
      setUserReactions(JSON.parse(savedReactions));
    }
  }, []);

  // Function to update like/dislike in Google Sheets using Google Apps Script
  const updateReactionInSheet = async (blogId, type, currentCount) => {
    try {
      // Replace with your Google Apps Script Web App URL
      const scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
      
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Important for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateReaction',
          blogId: blogId,
          type: type,
          value: currentCount + 1
        })
      });
      
      // Since we're using no-cors, we can't read the response directly
      // But we can assume it worked if no error was thrown
      showSnackbar(`Your ${type} was recorded!`, 'success');
      
    } catch (error) {
      console.error('Error updating reaction:', error);
      showSnackbar('Failed to record your reaction. Please try again.', 'error');
    }
  };

  // Handle like action
  const handleLike = async (blogId) => {
    const currentReaction = userReactions[blogId];
    const blog = blogData.find(b => b.id === blogId.toString());
    let newLikeCount = parseInt(blog.like) || 0;
    let newDislikeCount = parseInt(blog.dislike) || 0;
    
    if (currentReaction === 'like') {
      // If already liked, remove the like
      newLikeCount = Math.max(0, newLikeCount - 1);
    } else if (currentReaction === 'dislike') {
      // If disliked, switch to like
      newDislikeCount = Math.max(0, newDislikeCount - 1);
      newLikeCount += 1;
    } else {
      // If no reaction, add like
      newLikeCount += 1;
    }
    
    // Update local state
    setBlogData(prevData => 
      prevData.map(blog => {
        if (blog.id === blogId.toString()) {
          return { 
            ...blog, 
            like: newLikeCount,
            dislike: newDislikeCount
          };
        }
        return blog;
      })
    );
    
    // Update user reactions
    const newReactions = { ...userReactions };
    if (currentReaction === 'like') {
      delete newReactions[blogId];
    } else {
      newReactions[blogId] = 'like';
    }
    setUserReactions(newReactions);
    localStorage.setItem('blogReactions', JSON.stringify(newReactions));
    
    // Update the sheet
    await updateReactionInSheet(blogId, 'like', parseInt(blog.like) || 0);
  };

  // Handle dislike action
  const handleDislike = async (blogId) => {
    const currentReaction = userReactions[blogId];
    const blog = blogData.find(b => b.id === blogId.toString());
    let newLikeCount = parseInt(blog.like) || 0;
    let newDislikeCount = parseInt(blog.dislike) || 0;
    
    if (currentReaction === 'dislike') {
      // If already disliked, remove the dislike
      newDislikeCount = Math.max(0, newDislikeCount - 1);
    } else if (currentReaction === 'like') {
      // If liked, switch to dislike
      newLikeCount = Math.max(0, newLikeCount - 1);
      newDislikeCount += 1;
    } else {
      // If no reaction, add dislike
      newDislikeCount += 1;
    }
    
    // Update local state
    setBlogData(prevData => 
      prevData.map(blog => {
        if (blog.id === blogId.toString()) {
          return { 
            ...blog, 
            like: newLikeCount,
            dislike: newDislikeCount
          };
        }
        return blog;
      })
    );
    
    // Update user reactions
    const newReactions = { ...userReactions };
    if (currentReaction === 'dislike') {
      delete newReactions[blogId];
    } else {
      newReactions[blogId] = 'dislike';
    }
    setUserReactions(newReactions);
    localStorage.setItem('blogReactions', JSON.stringify(newReactions));
    
    // Update the sheet
    await updateReactionInSheet(blogId, 'dislike', parseInt(blog.dislike) || 0);
  };

  // Get unique categories
  const categories = useMemo(() => {
    if (!blogData.length) return ['All'];
    const uniqueCategories = [...new Set(blogData.map(blog => blog.category))];
    return ['All', ...uniqueCategories.filter(Boolean)];
  }, [blogData]);

  const getDirectImageUrl = (url) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1] || 
                    url.match(/id=([^&]+)/)?.[1] || 
                    url.split('/').slice(-1)[0];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };

  const isVideo = (url) => {
    if (!url) return false;
    return url.includes('drive.google.com');
  };

  const getThumbnailForVideo = (url) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1] || 
                    url.match(/id=([^&]+)/)?.[1] || 
                    url.split('/').slice(-1)[0];
      return `https://img.youtube.com/vi/${fileId}/hqdefault.jpg`;
    }
    return 'https://i.imgur.com/zvWTUVu.jpg';
  };

  // Combined filter function
  const filteredBlogs = useMemo(() => {
    let result = blogData;
    
    if (selectedCategory !== 'All') {
      result = result.filter(blog => blog.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog => 
        (blog.title && blog.title.toLowerCase().includes(query)) ||
        (blog.category && blog.category.toLowerCase().includes(query)) ||
        (blog.content && blog.content.toLowerCase().includes(query)) ||
        (blog.shortdesc && blog.shortdesc.toLowerCase().includes(query)) ||
        (blog.writer && blog.writer.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [blogData, selectedCategory, searchQuery]);

  const handleClickOpen = (blog) => {
    setSelectedBlog(blog);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error loading blog data: {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ flexGrow: 1, py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
        Our Blog
      </Typography>
      
      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search blogs, writers..."
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="blog categories"
        >
          {categories.map(category => (
            <Tab 
              key={category} 
              label={category} 
              value={category} 
              sx={{ textTransform: 'none', fontSize: '1rem' }}
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Blog Grid */}
      <Grid container spacing={4}>
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <CardActionArea onClick={() => handleClickOpen(blog)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      (blog.images && blog.images.length > 0) 
                        ? isVideo(blog.images[0])
                          ? getThumbnailForVideo(blog.images[0])
                          : getDirectImageUrl(blog.images[0])
                        : 'https://source.unsplash.com/random/300x200/?blog'
                    }
                    alt={blog.title || 'Blog image'}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    {blog.category && (
                      <Chip 
                        label={blog.category} 
                        size="small" 
                        color="primary"
                        sx={{ mb: 1 }}
                      />
                    )}
                    <Typography gutterBottom variant="h5" component="h2">
                      {blog.title || 'Untitled Blog'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {blog.shortdesc || 'No description available'}
                    </Typography>
                    
                    {/* Writer Information */}
                    {blog.writer && (
                      <WriterInfo>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                          <PersonIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          By {blog.writer}
                        </Typography>
                      </WriterInfo>
                    )}
                  </CardContent>
                </CardActionArea>
                
                {/* Like/Dislike Buttons */}
                <LikeDislikeContainer>
                  <ActionButton 
                    startIcon={<ThumbUpIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(blog.id);
                    }}
                    active={userReactions[blog.id] === 'like'}
                    size="small"
                  >
                    {blog.like || 0}
                  </ActionButton>
                  <ActionButton 
                    startIcon={<ThumbDownIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDislike(blog.id);
                    }}
                    active={userReactions[blog.id] === 'dislike'}
                    size="small"
                  >
                    {blog.dislike || 0}
                  </ActionButton>
                </LikeDislikeContainer>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" sx={{ py: 4 }}>
              No blogs found matching your search criteria
            </Typography>
          </Grid>
        )}
      </Grid>
      
      {/* Blog Detail Dialog */}
      <BlogDetailDialog 
        blog={selectedBlog} 
        open={open} 
        onClose={handleClose}
        onLike={handleLike}
        onDislike={handleDislike}
        userReactions={userReactions}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlogPage;