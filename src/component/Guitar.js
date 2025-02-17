import React, { useState, useEffect, useRef } from 'react';
import { Slider, Typography, Box, Button, Grid } from '@mui/material';
import * as Tone from 'tone';

const Guitar = () => {
  const [volume, setVolume] = useState(-10); // Default volume in decibels
  const stringsRef = useRef([]);

  // Guitar strings and their corresponding pitches
  const strings = [
    { name: 'E2', pitch: 'E2' },
    { name: 'A2', pitch: 'A2' },
    { name: 'D3', pitch: 'D3' },
    { name: 'G3', pitch: 'G3' },
    { name: 'B3', pitch: 'B3' },
    { name: 'E4', pitch: 'E4' },
  ];

  // Initialize the pluck synths for each string
  useEffect(() => {
    stringsRef.current = strings.map((string) => {
      const synth = new Tone.PluckSynth({
        attackNoise: 1, // Simulate the pluck of a string
        dampening: 4000, // Control the decay of the sound
        resonance: 0.7, // Add resonance for a richer tone
      }).toDestination();
      synth.volume.value = volume; // Set initial volume
      return synth;
    });

    return () => {
      stringsRef.current.forEach((synth) => synth.dispose()); // Clean up the synths
    };
  }, []);

  // Update the volume when the slider changes
  const handleVolumeChange = (event, value) => {
    setVolume(value);
    stringsRef.current.forEach((synth) => (synth.volume.value = value)); // Update the volume for all strings
  };

  // Play a single string
  const playString = async (pitch) => {
    await Tone.start(); // Ensure Tone.js is initialized
    const synth = stringsRef.current[strings.findIndex((s) => s.pitch === pitch)];
    synth.triggerAttackRelease(pitch, '8n'); // Play the note for an eighth note duration
  };

  // Map chord notes to the nearest guitar string pitches
  const mapNoteToGuitarString = (note) => {
    const guitarPitches = strings.map((s) => s.pitch);
    const noteMidi = Tone.Frequency(note).toMidi();
    let closestPitch = guitarPitches[0];
    let minDistance = Infinity;

    guitarPitches.forEach((pitch) => {
      const pitchMidi = Tone.Frequency(pitch).toMidi();
      const distance = Math.abs(noteMidi - pitchMidi);
      if (distance < minDistance) {
        minDistance = distance;
        closestPitch = pitch;
      }
    });

    return closestPitch;
  };

  // Check if a chord is playable
  const isChordPlayable = (chord) => {
    return chord.every((note) => {
      const closestPitch = mapNoteToGuitarString(note);
      return strings.some((s) => s.pitch === closestPitch);
    });
  };

  // Play a chord (multiple strings simultaneously)
  const playChord = async (chord) => {
    await Tone.start(); // Ensure Tone.js is initialized
    chord.forEach((note) => {
      const closestPitch = mapNoteToGuitarString(note);
      const synthIndex = strings.findIndex((s) => s.pitch === closestPitch);
      if (synthIndex !== -1) {
        const synth = stringsRef.current[synthIndex];
        synth.triggerAttackRelease(closestPitch, '8n'); // Play the note for an eighth note duration
      } else {
        console.error(`No synth found for pitch: ${closestPitch}`);
      }
    });
  };

  // Common guitar chords
  const chords = {
    'C Major': ['C3', 'E3', 'G3'],
    'G Major': ['G3', 'B3', 'D4'],
    'D Major': ['D3', 'F#3', 'A3'],
    'A Minor': ['A2', 'C3', 'E3'],
    'E Minor': ['E2', 'G2', 'B2'],
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Guitar
      </Typography>
      <Box sx={{ mb: 2 }}>
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Strings
        </Typography>
        <Grid container spacing={2}>
          {strings.map((string) => (
            <Grid item key={string.pitch}>
              <Button variant="contained" onClick={() => playString(string.pitch)}>
                {string.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Chords
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(chords).map(([name, notes]) => (
            <Grid item key={name}>
              <Button
                variant="contained"
                onClick={() => playChord(notes)}
                disabled={!isChordPlayable(notes)} // Disable button if chord is not playable
              >
                {name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Guitar;