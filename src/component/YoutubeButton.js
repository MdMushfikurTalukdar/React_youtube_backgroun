import React from 'react';
import Button from '@mui/material/Button';

const YoutubeButton = () => {
  const handleClick = () => {
    window.open('https://www.youtube.com', '_blank');
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleClick}
      startIcon={
        <img
          src="https://www.youtube.com/favicon.ico"
          alt="YouTube Icon"
          style={{ width: '24px', height: '24px' }}
        />
      }
    >
      YouTube
    </Button>
  );
};

export default YoutubeButton;