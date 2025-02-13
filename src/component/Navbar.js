import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router-dom"; // For navigation

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null); // For mobile menu
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is mobile

  // Handle mobile menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle mobile menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle YouTube button click
  const handleYouTubeClick = () => {
    window.open("https://www.youtube.com", "_blank");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>

        {/* Fun Option (Desktop) */}
        {!isMobile && (
          <Button color="inherit" component={Link} to="/fun">
            Fun
          </Button>
        )}

        {/* Live Draw Option (Desktop) */}
        {!isMobile && (
          <Button color="inherit" component={Link} to="/live-draw">
            Live Draw
          </Button>
        )}

        {/* YouTube Button (Desktop) */}
        {!isMobile && (
          <Button
            color="inherit"
            startIcon={<YouTubeIcon />}
            onClick={handleYouTubeClick}
          >
            YouTube
          </Button>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/fun" onClick={handleMenuClose}>
                Fun
              </MenuItem>
              <MenuItem component={Link} to="/live-draw" onClick={handleMenuClose}>
                Live Draw
              </MenuItem>
              <MenuItem onClick={handleYouTubeClick}>
                <YouTubeIcon sx={{ marginRight: 1 }} />
                YouTube
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;