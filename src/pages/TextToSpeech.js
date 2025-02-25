import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TextSpeech from '../component/TextSpeech';
import Recorder from '../component/Recorder2';

const TextToSpeech = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Text To Speech
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <TextSpeech />
        {/* <Recorder /> */}
      </Box>
    </Container>
  );
};

export default TextToSpeech;