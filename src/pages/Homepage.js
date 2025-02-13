import React from "react";
import { Container, Typography, Button, Box, useMediaQuery, useTheme } from "@mui/material";

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is mobile

  return (
    <Container sx={{ textAlign: "center", marginTop: 4 }}>
      {/* Responsive Typography */}
      <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>
        Welcome to MyApp
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        This is a simple and clean homepage for your app.
      </Typography>

      {/* Call-to-Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexDirection: isMobile ? "column" : "row" }}>
        <Button variant="contained" color="primary" fullWidth={isMobile}>
          Get Started
        </Button>
        <Button variant="outlined" color="secondary" fullWidth={isMobile}>
          Learn More
        </Button>
      </Box>
    </Container>
  );
};

export default Homepage;