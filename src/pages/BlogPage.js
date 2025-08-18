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
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';

// Styled components
const StyledCard = styled(Card)({
  maxWidth: 345,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
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

const BlogDetailDialog = ({ blog, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                    src={blog.images[currentIndex]}
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
        
        <Typography variant="body1" paragraph>
          {blog.content || 'No content available'}
        </Typography>
      </DialogContent>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </Box>
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
              } else {
                obj[key] = row.c[index]?.v || '';
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

  // Get unique categories
  const categories = useMemo(() => {
    if (!blogData.length) return ['All'];
    const uniqueCategories = [...new Set(blogData.map(blog => blog.category))];
    return ['All', ...uniqueCategories.filter(Boolean)];
  }, [blogData]);

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
        (blog.shortdesc && blog.shortdesc.toLowerCase().includes(query))
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
        placeholder="Search blogs..."
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
                          : blog.images[0]
                        : 'https://source.unsplash.com/random/300x200/?blog'
                    }
                    alt={blog.title || 'Blog image'}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <CardContent>
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
                    <Typography variant="body2" color="text.secondary">
                      {blog.shortdesc || 'No description available'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
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
      />
    </Container>
  );
};

export default BlogPage;