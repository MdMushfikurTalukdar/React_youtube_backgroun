import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Drawer,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Rating,
  Tabs,
  Tab,
  Paper,
  Container,
  Fade,
  Zoom,
  Slide,
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Badge,
  Hidden
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  GridView as GridViewIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Sort as SortIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';

import { createTheme, ThemeProvider, alpha, styled } from '@mui/material/styles';
import { pink, blue, green, orange, deepPurple, teal, indigo } from '@mui/material/colors';

// Create a custom theme with a modern color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: indigo[700],
      light: indigo[50],
    },
    secondary: {
      main: teal[500],
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease-in-out',
          border: '1px solid',
          borderColor: alpha('#000', 0.08),
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
          padding: '8px 20px',
          fontSize: '0.875rem',
          '@media (max-width:600px)': {
            padding: '6px 16px',
            fontSize: '0.8rem',
          },
        },
        contained: {
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
          '@media (max-width:600px)': {
            fontSize: '0.7rem',
            height: '24px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        flexContainer: {
          flexWrap: 'wrap',
          '@media (max-width:600px)': {
            justifyContent: 'center',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          padding: '8px 16px',
          fontSize: '0.875rem',
          '@media (max-width:600px)': {
            padding: '6px 12px',
            fontSize: '0.8rem',
          },
        },
      },
    },
  },
});

// Styled components for better responsiveness
const ResponsiveGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    margin: '0 -8px',
    '& > .MuiGrid-item': {
      padding: '8px',
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    borderRadius: '12px',
  },
}));

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`category-tabpanel-${index}`}
      aria-labelledby={`category-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const TemplateGallery = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [mobileNavValue, setMobileNavValue] = useState(0);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const customTheme = useTheme();
  const isMobile = useMediaQuery(customTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(customTheme.breakpoints.down('sm'));

  // Fetch templates from Google Sheets using the provided method
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const sheetId = '1cqiNJCzdTQPVYhAuX7i9TEmPLsESwBEYXf5Ld9AkUBk';
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheets');
      }
      
      const text = await response.text();
      // Remove the prefix that Google Sheets adds
      const json = JSON.parse(text.substring(47).slice(0, -2));
      
      // Process the data from Google Sheets
      if (json.table && json.table.rows && json.table.rows.length > 1) {
        const rows = json.table.rows;
        const headers = rows[0].c.map(header => header.v.toLowerCase().replace(/\s+/g, ''));
        
        const templateData = rows.slice(1).map((row, index) => {
          const template = {};
          headers.forEach((header, i) => {
            if (row.c[i] && row.c[i].v !== null) {
              template[header] = row.c[i].v;
            } else {
              template[header] = '';
            }
          });
          
          // Ensure required fields with fallbacks
          return {
            id: index + 1,
            name: template.name || `Template ${index + 1}`,
            description: template.description || 'No description available',
            image: template.imageurl || template.image || `https://picsum.photos/600/400?random=${index}`,
            githubUrl: template.githuburl || template.github || '#',
            downloadUrl: template.downloadurl || template.download || '#',
            tags: template.tags ? template.tags.split(',').map(tag => tag.trim()) : [],
            category: template.category || 'Uncategorized',
            dateAdded: template.dateadded || new Date().toISOString().split('T')[0],
            rating: Math.floor(Math.random() * 5) + 1, // Random rating for demo
            downloads: Math.floor(Math.random() * 1000) + 100 // Random download count
          };
        });
        
        setTemplates(templateData);
        setFilteredTemplates(templateData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(templateData.map(template => template.category))];
        setCategories(["All", ...uniqueCategories]);
      } else {
        // Fallback to mock data if no data in sheet
        setTemplates(mockTemplates);
        setFilteredTemplates(mockTemplates);
        
        const uniqueCategories = [...new Set(mockTemplates.map(template => template.category))];
        setCategories(["All", ...uniqueCategories]);
        
        setSuccess('Using demo data as the sheet is empty');
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setError('Failed to fetch templates. Using demo data instead.');
      
      // Fallback to mock data
      setTemplates(mockTemplates);
      setFilteredTemplates(mockTemplates);
      
      const uniqueCategories = [...new Set(mockTemplates.map(template => template.category))];
      setCategories(["All", ...uniqueCategories]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate random color
  const getRandomColor = () => {
    const colors = ['3f51b5', '4caf50', 'ff9800', 'e91e63', '607d8b', '009688', '673ab7', '00bcd4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Filter and sort templates based on search, category, and sort options
  useEffect(() => {
    let results = templates;
    
    if (searchQuery) {
      results = results.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedCategory !== "All") {
      results = results.filter(template => template.category === selectedCategory);
    }
    
    // Sort templates
    results = [...results].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      } else if (sortBy === 'popular') {
        return b.downloads - a.downloads;
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });
    
    setFilteredTemplates(results);
  }, [searchQuery, selectedCategory, templates, sortBy]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleDownload = (template) => {
    window.open(template.downloadUrl, '_blank');
    setSuccess(`Downloading ${template.name}...`);
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const category = newValue === 0 ? "All" : categories[newValue];
    setSelectedCategory(category);
  };

  const toggleFavorite = (templateId) => {
    if (favorites.includes(templateId)) {
      setFavorites(favorites.filter(id => id !== templateId));
    } else {
      setFavorites([...favorites, templateId]);
    }
  };

  const renderTemplates = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh" flexDirection="column">
          <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading templates...
          </Typography>
        </Box>
      );
    }

    if (filteredTemplates.length === 0) {
      return (
        <Box textAlign="center" py={8}>
          <Box sx={{ 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            backgroundColor: 'primary.light', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mx: 'auto',
            mb: 2
          }}>
            <SearchIcon sx={{ fontSize: 50, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No templates found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Try adjusting your search or filters to find what you're looking for.
          </Typography>
        </Box>
      );
    }

    return (
      <ResponsiveGrid container spacing={isSmallMobile ? 1 : 3}>
        {filteredTemplates.map((template, index) => (
          <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} key={template.id}>
            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
              <StyledCard>
                <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      backgroundColor: favorites.includes(template.id) ? pink[50] : 'rgba(255,255,255,0.9)',
                      '&:hover': { backgroundColor: pink[100] },
                      boxShadow: 1
                    }}
                    onClick={() => toggleFavorite(template.id)}
                  >
                    <FavoriteIcon color={favorites.includes(template.id) ? 'secondary' : 'disabled'} />
                  </IconButton>
                </Box>
                
                <CardMedia
                  component="img"
                  sx={{ 
                    height: isSmallMobile ? 160 : 200, 
                    objectFit: 'cover',
                    width: '100%'
                  }}
                  image={template.image}
                  alt={template.name}
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/600/400?random=${template.id}`;
                  }}
                />
                
                <Box sx={{ 
                  position: 'absolute', 
                  top: isSmallMobile ? 130 : 160, 
                  right: 16, 
                  backgroundColor: 'primary.main', 
                  color: 'white', 
                  borderRadius: 2, 
                  px: 1.5, 
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  boxShadow: 2
                }}>
                  {template.category}
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: isSmallMobile ? 2 : 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ flexGrow: 1, fontWeight: 600 }}>
                      {template.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Rating value={template.rating} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({template.rating.toFixed(1)})
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: isSmallMobile ? '0.875rem' : '1rem'
                    }}
                  >
                    {template.description}
                  </Typography>
                  
                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                      {template.tags.slice(0, 3).map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          variant="outlined" 
                          sx={{ 
                            backgroundColor: 'primary.light',
                            border: 'none',
                            fontSize: '0.7rem'
                          }} 
                        />
                      ))}
                      {template.tags.length > 3 && (
                        <Chip label={`+${template.tags.length - 3}`} size="small" />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {template.downloads.toLocaleString()} downloads
                      </Typography>
                      {template.dateAdded && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(template.dateAdded).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: isSmallMobile ? 2 : 3, pt: 0, justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewTemplate(template)}
                    sx={{ color: 'text.secondary' }}
                  >
                    Preview
                  </Button>
                  <Button 
                    size="medium" 
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(template)}
                    variant="contained"
                    sx={{ 
                      borderRadius: 2,
                      px: 2.5,
                      py: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    Download
                  </Button>
                </CardActions>
              </StyledCard>
            </Zoom>
          </Grid>
        ))}
      </ResponsiveGrid>
    );
  };

  const filterDrawer = (
    <Box sx={{ 
      width: { xs: '100%', sm: 300 }, 
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Typography variant="h6" sx={{ 
        mb: 3, 
        fontWeight: 600, 
        display: 'flex', 
        alignItems: 'center',
        color: 'primary.main'
      }}>
        <FilterIcon sx={{ mr: 1.5 }} /> 
        Filter Templates
      </Typography>
      
      {/* Sort Section */}
      <Paper elevation={0} sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 3, 
        backgroundColor: 'grey.50',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
      }}>
        <Typography variant="subtitle2" sx={{ 
          mb: 2, 
          fontWeight: 600, 
          display: 'flex',
          alignItems: 'center'
        }}>
          <SortIcon sx={{ mr: 1, fontSize: 20 }} /> 
          Sort By
        </Typography>
        
        <FormControl fullWidth size="small">
          <InputLabel>Sort By</InputLabel>
          <Select 
            value={sortBy} 
            label="Sort By"
            onChange={handleSortChange}
            sx={{
              borderRadius: 2,
              backgroundColor: 'white',
              '& .MuiSelect-select': {
                py: 1.2
              }
            }}
          >
            <MenuItem value="name">Name (A-Z)</MenuItem>
            <MenuItem value="date">Newest First</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="category">Category</MenuItem>
          </Select>
        </FormControl>
      </Paper>
      
      {/* Categories Section */}
      <Paper elevation={0} sx={{ 
        p: 2, 
        borderRadius: 3, 
        flexGrow: 1,
        backgroundColor: 'grey.50',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
      }}>
        <Typography variant="subtitle2" sx={{ 
          mb: 2, 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center'
        }}>
          <CategoryIcon sx={{ mr: 1, fontSize: 20 }} /> 
          Categories
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1,
          maxHeight: isMobile ? 'none' : 'calc(100vh - 320px)',
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[300],
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.grey[400],
          }
        }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryChange(category)}
              variant={selectedCategory === category ? "filled" : "outlined"}
              color={selectedCategory === category ? "primary" : "default"}
              sx={{ 
                justifyContent: 'flex-start',
                py: 1.5,
                borderRadius: 2,
                fontSize: '0.95rem',
                fontWeight: selectedCategory === category ? 600 : 400,
                backgroundColor: selectedCategory === category ? 'primary.light' : 'transparent',
                borderColor: selectedCategory === category ? 'primary.main' : 'grey.300',
                '&:hover': {
                  backgroundColor: selectedCategory === category ? 'primary.light' : 'grey.100',
                }
              }}
              icon={selectedCategory === category ? 
                <CheckCircleIcon color="primary" sx={{ fontSize: 18 }} /> : 
                <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: 'grey.500' }} />
              }
            />
          ))}
        </Box>
      </Paper>
      
      {/* Stats Section */}
      {!isMobile && (
        <Paper elevation={0} sx={{ 
          p: 2, 
          mt: 2, 
          borderRadius: 3, 
          backgroundColor: 'primary.light',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InsightsIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.dark' }}>
              Template Stats
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'primary.dark', opacity: 0.8 }}>
            {categories.length - 1} categories
          </Typography>
        </Paper>
      )}
    </Box>
  );

  // Mock data for fallback
  const mockTemplates = [
    {
      id: 1,
      name: "Modern Portfolio",
      description: "A sleek portfolio template with dark mode, animations, and responsive design. Perfect for designers and developers to showcase their work.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      githubUrl: "https://github.com/example/modern-portfolio",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1EXAMPLE1DRIVE2FILE3ID4PORTFOLIO",
      tags: ["React", "Material UI", "Portfolio", "Dark Mode", "Responsive"],
      category: "Portfolio",
      dateAdded: "2023-10-15",
      rating: 4.5,
      downloads: 1247
    },
    {
      id: 2,
      name: "E-commerce Store",
      description: "Complete online store with product filters, cart, and checkout functionality. Includes admin dashboard for managing products and orders.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      githubUrl: "https://github.com/example/ecommerce-store",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1EXAMPLE1DRIVE2FILE3ID4ECOMMERCE",
      tags: ["React", "Redux", "E-commerce", "Shopping Cart", "Checkout"],
      category: "E-commerce",
      dateAdded: "2023-10-10",
      rating: 4.2,
      downloads: 2893
    },
    {
      id: 3,
      name: "Blog Platform",
      description: "Modern blog template with categories, tags, and search functionality. Includes rich text editor and comment system for engaging content.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      githubUrl: "https://github.com/example/blog-platform",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1EXAMPLE1DRIVE2FILE3ID4BLOG",
      tags: ["React", "Contentful", "Blog", "CMS", "SEO"],
      category: "Blog",
      dateAdded: "2023-10-05",
      rating: 4.7,
      downloads: 1756
    }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default', pb: isMobile ? 7 : 0 }}>
        <AppBar position="sticky" elevation={2}>
          <Toolbar sx={{ py: 1.5 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ color: 'white' }}>Template</Box>
              <Box component="span" sx={{ color: 'secondary.main', ml: 0.5 }}>Hub</Box>
            </Typography>
            
            {!isMobile && (
              <TextField
                size="small"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ 
                  mr: 2, 
                  backgroundColor: alpha('#fff', 0.15),
                  borderRadius: 2,
                  width: isMobile ? '100%' : 300,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            
            <Hidden smDown>
              <IconButton 
                color="inherit" 
                onClick={toggleViewMode} 
                sx={{ mr: 1 }}
              >
                {viewMode === 'grid' ? <FormatListBulletedIcon /> : <GridViewIcon />}
              </IconButton>
            </Hidden>
            
            <IconButton color="inherit" onClick={fetchTemplates}>
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Mobile Search Bar */}
        {isMobile && (
          <Paper elevation={2} sx={{ p: 2, m: 2, borderRadius: 3 }}>
            <TextField
              fullWidth
              placeholder="Search templates..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        )}

        <Container maxWidth="xl" sx={{ py: 3, px: isSmallMobile ? 1 : 3 }}>
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Sidebar for filters on desktop */}
            {!isMobile && (
              <Box
                sx={{
                  width: 300,
                  flexShrink: 0,
                  display: { xs: 'none', md: 'block' },
                  p: 3,
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  mr: 3,
                  boxShadow: 2,
                  height: 'fit-content',
                  position: 'sticky',
                  top: 100
                }}
              >
                {filterDrawer}
              </Box>
            )}

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, width: isMobile ? '100%' : 'auto' }}>
              <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  Discover Amazing Templates
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                  Browse our collection of professionally designed templates to kickstart your next project
                </Typography>
              </Paper>
              
              <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, backgroundColor: 'background.paper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    variant={isMobile ? "scrollable" : "standard"}
                    scrollButtons="auto"
                    sx={{ minHeight: 'auto' }}
                    allowScrollButtonsMobile
                  >
                    <Tab label="All" />
                    {categories.filter(cat => cat !== "All").map((category, index) => (
                      <Tab key={category} label={category} />
                    ))}
                  </Tabs>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1.5 }}>
                      {filteredTemplates.length} templates
                    </Typography>
                    <Chip 
                      label={selectedCategory} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                      sx={{ fontWeight: 500 }} 
                    />
                  </Box>
                </Box>
              </Paper>
              
              {renderTemplates()}
            </Box>
          </Box>
        </Container>

        {/* Mobile filter drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { width: { xs: '100%', sm: 300 } } }}
        >
          {filterDrawer}
        </Drawer>

        {/* Mobile bottom navigation */}
        {isMobile && (
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
            <BottomNavigation
              showLabels
              value={mobileNavValue}
              onChange={(event, newValue) => {
                setMobileNavValue(newValue);
              }}
            >
              <BottomNavigationAction label="Home" icon={<HomeIcon />} />
              <BottomNavigationAction label="Categories" icon={<CategoryIcon />} onClick={() => setDrawerOpen(true)} />
              <BottomNavigationAction label="Favorites" icon={<FavoriteBorderIcon />} />
            </BottomNavigation>
          </Paper>
        )}

        {/* Mobile Speed Dial for actions */}
        {isMobile && (
          <SpeedDial
            ariaLabel="Template actions"
            sx={{ position: 'fixed', bottom: 70, right: 16 }}
            icon={<SpeedDialIcon />}
            open={speedDialOpen}
            onOpen={() => setSpeedDialOpen(true)}
            onClose={() => setSpeedDialOpen(false)}
          >
            <SpeedDialAction
              icon={<ViewModuleIcon />}
              tooltipTitle={viewMode === 'grid' ? 'List View' : 'Grid View'}
              onClick={toggleViewMode}
            />
            <SpeedDialAction
              icon={<FilterIcon />}
              tooltipTitle="Filters"
              onClick={() => setDrawerOpen(true)}
            />
          </SpeedDial>
        )}

        {/* Template Preview Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isSmallMobile}
          PaperProps={{ sx: { borderRadius: isSmallMobile ? 0 : 3, overflow: 'hidden' } }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            pb: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              {selectedTemplate?.name}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setDialogOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <img
              src={selectedTemplate?.image}
              alt={selectedTemplate?.name}
              style={{ width: '100%', height: isSmallMobile ? 200 : 300, objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = `https://picsum.photos/600/400?random=${selectedTemplate?.id}`;
              }}
            />
            <Box sx={{ p: isSmallMobile ? 2 : 3 }}>
              <Typography variant="body1" gutterBottom>
                {selectedTemplate?.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                <Chip label={selectedTemplate?.category} color="primary" />
                {selectedTemplate?.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={selectedTemplate?.rating} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({selectedTemplate?.rating}/5)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Downloads:</Box> {selectedTemplate?.downloads?.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Date Added:</Box> {new Date(selectedTemplate?.dateAdded).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Box component="span" sx={{ fontWeight: 'bold' }}>GitHub:</Box>{' '}
                  <a href={selectedTemplate?.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                    {selectedTemplate?.githubUrl}
                  </a>
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={() => setDialogOpen(false)}
              variant="outlined"
            >
              Close
            </Button>
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />}
              onClick={() => {
                handleDownload(selectedTemplate);
                setDialogOpen(false);
              }}
              sx={{ 
                borderRadius: 2,
                px: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Download Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <Snackbar 
          open={!!success} 
          autoHideDuration={6000} 
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default TemplateGallery;