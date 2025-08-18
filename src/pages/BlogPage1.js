import React, { useState, useMemo } from 'react';
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
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Sample blog data (same as before)
const blogData = [
  {
    id: 1,
    title: 'Getting Started with React',
    category: 'Technology',
    image: 'https://source.unsplash.com/random/300x200/?react',
    shortDesc: 'Learn the basics of React in this beginner-friendly guide.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.'
  },
  {
    id: 2,
    title: 'Healthy Eating Habits',
    category: 'Health',
    image: 'https://source.unsplash.com/random/300x200/?food',
    shortDesc: 'Discover simple ways to improve your diet and health.',
    content: 'Proin condimentum fermentum nunc. Etiam pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque. Suspendisse in orci enim. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.'
  },
  {
    id: 3,
    title: 'Travel Guide: Bali',
    category: 'Travel',
    image: 'https://source.unsplash.com/random/300x200/?bali',
    shortDesc: 'Everything you need to know for your Bali adventure.',
    content: 'Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple. To the south, the beachside city of Kuta has lively bars, while Seminyak, Sanur and Nusa Dua are popular resort towns. The island is also known for its yoga and meditation retreats.'
  },
  {
    id: 4,
    title: 'Advanced JavaScript Patterns',
    category: 'Technology',
    image: 'https://source.unsplash.com/random/300x200/?javascript',
    shortDesc: 'Explore advanced patterns to level up your JS skills.',
    content: 'JavaScript design patterns are reusable solutions to commonly occurring problems in software design. They are proven solutions, easily reusable and expressive. They lower the size of your codebase, prevent future refactoring, and make your code easier to understand by other developers. In this article, we will discuss some important patterns every JavaScript developer should know.'
  },
  {
    id: 5,
    title: 'Meditation for Beginners',
    category: 'Health',
    image: 'https://source.unsplash.com/random/300x200/?meditation',
    shortDesc: 'Start your meditation journey with these simple steps.',
    content: 'Meditation is a practice where an individual uses a technique – such as mindfulness, or focusing the mind on a particular object, thought, or activity – to train attention and awareness, and achieve a mentally clear and emotionally calm and stable state. Meditation is practiced in numerous religious traditions. The earliest records of meditation (dhyana) are found in the Upanishads of Hindu philosophy.'
  }
];

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

  // Get unique categories
  const categories = ['All', ...new Set(blogData.map(blog => blog.category))];

  // Combined filter function
  const filteredBlogs = useMemo(() => {
    let result = blogData;
    
    // First filter by category if not 'All'
    if (selectedCategory !== 'All') {
      result = result.filter(blog => blog.category === selectedCategory);
    }
    
    // Then filter by search query if exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query) ||
        blog.shortDesc.toLowerCase().includes(query)
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
          filteredBlogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <StyledCard>
                <CardActionArea onClick={() => handleClickOpen(blog)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={blog.image}
                    alt={blog.title}
                  />
                  <CardContent>
                    <Chip 
                      label={blog.category} 
                      size="small" 
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                    <Typography gutterBottom variant="h5" component="h2">
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {blog.shortDesc}
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
      
      {/* Blog Detail Dialog (same as before) */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                {selectedBlog && (
                <>
                    <DialogTitle>
                    <Typography variant="h4" component="div">
                        {selectedBlog.title}
                    </Typography>
                    <Chip 
                        label={selectedBlog.category} 
                        size="small" 
                        color="primary"
                        sx={{ mt: 1 }}
                    />
                    </DialogTitle>
                    <DialogContent dividers>
                    <DialogImage 
                        src={selectedBlog.image} 
                        alt={selectedBlog.title}
                    />
                    <Typography variant="body1" paragraph>
                        {selectedBlog.content}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {selectedBlog.content} {/* Duplicated for longer content */}
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