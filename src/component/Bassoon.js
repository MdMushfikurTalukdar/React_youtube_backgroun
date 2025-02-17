import React, { useState, useEffect, useRef } from 'react';
import { Slider, Typography, Box, Button } from '@mui/material';
import * as Tone from 'tone';

const Bassoon = () => {
  const [pitch, setPitch] = useState('C2'); // Default pitch
  const [volume, setVolume] = useState(-10); // Default volume in decibels
  const synthRef = useRef(null);

  // Initialize the synthesizer
  useEffect(() => {
    synthRef.current = new Tone.MonoSynth({
      oscillator: {
        type: 'sawtooth', // A sawtooth wave for a rich sound
      },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.5,
        release: 1,
      },
      filter: {
        type: 'lowpass',
        frequency: 200, // Low-pass filter for a warm tone
      },
    }).toDestination();

    return () => {
      synthRef.current.dispose(); // Clean up the synthesizer
    };
  }, []);

  // Update the volume when the slider changes
  const handleVolumeChange = (event, value) => {
    setVolume(value);
    synthRef.current.volume.value = value; // Update the volume
  };

  // Play a note
  const playNote = async () => {
    await Tone.start(); // Ensure Tone.js is initialized
    synthRef.current.triggerAttackRelease(pitch, '2n'); // Play the note for half a second
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bassoon
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography>Pitch: {pitch}</Typography>
        <Button variant="contained" onClick={playNote}>
          Play Note
        </Button>
      </Box>
      <Box>
        <Typography>Volume: {volume} dB</Typography>
        <Slider
          value={volume}
          min={-40}
          max={0}
          step={1}
          onChange={handleVolumeChange}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export default Bassoon;