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
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Styled components
const StyledCard = styled(Card)({
  maxWidth: 345,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const DialogImage = styled('img')({
  width: '100%',
  height: 300,
  objectFit: 'cover',
  marginBottom: 2,
});

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
        // Replace with your Google Sheet ID
        const sheetId = '1jy58BhhGVzqO7AVENfxwjfWtJQMkpmif0JtbaYZhIdU';
        const response = await fetch(
          `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        // Process the Google Sheets response
        const text = await response.text();
        const jsonText = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/)[1];
        const data = JSON.parse(jsonText);
        
        // Convert to usable format
        const rows = data.table.rows;
        const formattedData = rows.map(row => {
          const obj = {};
          data.table.cols.forEach((col, index) => {
            if (col.label) {
              // Convert headers to lowercase with no spaces for easy access
              const key = col.label.toLowerCase().replace(/\s+/g, '');
              obj[key] = row.c[index]?.v || '';
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
    return ['All', ...uniqueCategories.filter(Boolean)]; // Filter out undefined/null
  }, [blogData]);

  // Combined filter function
  const filteredBlogs = useMemo(() => {
    let result = blogData;
    
    // Filter by category if not 'All'
    if (selectedCategory !== 'All') {
      result = result.filter(blog => blog.category === selectedCategory);
    }
    
    // Filter by search query
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
                    image={blog.image || 'https://source.unsplash.com/random/300x200/?blog'}
                    alt={blog.title || 'Blog image'}
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {selectedBlog && (
          <>
            <DialogTitle>
              <Typography variant="h4" component="div">
                {selectedBlog.title || 'Untitled Blog'}
              </Typography>
              {selectedBlog.category && (
                <Chip 
                  label={selectedBlog.category} 
                  size="small" 
                  color="primary"
                  sx={{ mt: 1 }}
                />
              )}
            </DialogTitle>
            <DialogContent dividers>
              <DialogImage 
                src={selectedBlog.image || 'https://source.unsplash.com/random/800x400/?blog'} 
                alt={selectedBlog.title || 'Blog image'}
              />
              <Typography variant="body1" paragraph>
                {selectedBlog.content || 'No content available'}
              </Typography>
            </DialogContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} color="primary" variant="contained">
                Close
              </Button>
            </Box>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default BlogPage;