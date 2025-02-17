import React from 'react';
import { Button, Box, Typography } from '@mui/material';

const sounds = [
  { label: 'Boom 1', src: '/sounds/boom1.mp3' },
  { label: 'Boom 2', src: '/sounds/boom2.mp3' },
  { label: 'Boom 3', src: '/sounds/boom3.mp3' },
];

const BoomDomSound = () => {
  const playSound = (src) => {
    const audio = new Audio(src);
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Boom Dom Sound Generator
      </Typography>
      {sounds.map((sound, index) => (
        <Button
          key={index}
          variant="contained"
          color="primary"
          onClick={() => playSound(sound.src)}
          style={{ margin: '5px' }}
        >
          {sound.label}
        </Button>
      ))}
    </Box>
  );
};

export default BoomDomSound;