import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { Slider, Typography, Box } from '@mui/material';
import * as Tone from 'tone';

const Bit = () => {
  const [bitDepth, setBitDepth] = useState(16); // Default bit depth (16-bit)
  const bitCrusherRef = useRef(null);

  // Initialize the BitCrusher effect
  useEffect(() => {
    bitCrusherRef.current = new Tone.BitCrusher(bitDepth).toDestination();
    return () => {
      bitCrusherRef.current.dispose(); // Clean up the effect
    };
  }, []);

  // Update the bit depth when the slider changes
  const handleBitDepthChange = (event, value) => {
    setBitDepth(value);
    bitCrusherRef.current.bits = value; // Update the bit depth
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bit Crusher
      </Typography>
      <Typography>Bit Depth: {bitDepth}</Typography>
      <Slider
        value={bitDepth}
        min={1}
        max={16}
        step={1}
        onChange={handleBitDepthChange}
        valueLabelDisplay="auto"
      />
    </Box>
  );
};

export default Bit;