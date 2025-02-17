import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Piano from '../component/Piano';
import Harmony from '../component/Harmony';
import Recorder from '../component/Recorder';
import Bit from '../component/Bit';
import BoomDomSound from '../component/BoomDomSound';
import Bassoon from '../component/Bassoon';
import Guitar from '../component/Guitar';

const MusicMaker = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Music Maker
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Piano />
        <Harmony />
        <Bit />
        <BoomDomSound />
        <Bassoon />
        <Guitar />
        <Recorder />
      </Box>
    </Container>
  );
};

export default MusicMaker;