import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@mui/material';
import { Download as DownloadIcon, PlayArrow as PlayArrowIcon, Stop as StopIcon } from '@mui/icons-material';
import * as Tone from 'tone';

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const destinationRef = useRef(null);

  // Initialize audio context and routing
  useEffect(() => {
    const initializeAudio = async () => {
      await Tone.start(); // Start Tone.js audio context
      destinationRef.current = Tone.context.createMediaStreamDestination(); // Create a MediaStreamDestination
      Tone.Destination.connect(destinationRef.current); // Route Tone.js output to the destination
    };

    initializeAudio();
  }, []);

  const startRecording = () => {
    if (!destinationRef.current) {
      console.error('Audio destination not initialized.');
      return;
    }

    audioChunksRef.current = [];
    const mediaStream = destinationRef.current.stream; // Get the MediaStream from the destination
    mediaRecorderRef.current = new MediaRecorder(mediaStream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      setAudioUrl(URL.createObjectURL(audioBlob));
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'music.wav';
      link.click();
    }
  };

  return (
    <div>
      <h3>Recorder</h3>
      <div>
        {!isRecording ? (
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={startRecording}>
            Start Recording
          </Button>
        ) : (
          <Button variant="contained" startIcon={<StopIcon />} onClick={stopRecording}>
            Stop Recording
          </Button>
        )}
        {audioUrl && (
          <div>
            <audio controls src={audioUrl} />
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={downloadAudio}>
              Download WAV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recorder;