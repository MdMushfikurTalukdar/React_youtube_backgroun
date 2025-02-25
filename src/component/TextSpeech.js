import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, Container, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { PlayArrow as PlayArrowIcon, Download as DownloadIcon } from "@mui/icons-material";

const TextSpeechRecorder = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakAndRecord = async () => {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    try {
      // Step 1: Access the virtual audio device instead of the microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: "virtual_device_id" }, // Replace with your virtual device ID
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
      };

      mediaRecorder.start();

      // Step 2: Synthesize speech (no mic input involved)
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;

      window.speechSynthesis.speak(utterance);

      // Stop the recorder after the speech ends
      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
        }, 500); // Small delay to ensure recording finishes
      };
    } catch (err) {
      alert("Error accessing virtual audio device: " + err.message);
    }
  };

  const downloadAudio = () => {
    if (!audioBlob) {
      alert("No audio recorded yet!");
      return;
    }

    // Create a link to download the audio file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(audioBlob);
    link.download = "recorded_speech.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Text-to-Speech Recorder
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Enter text to convert to speech"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Voice</InputLabel>
          <Select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            label="Select Voice"
          >
            {voices.map((voice) => (
              <MenuItem key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={speakAndRecord}>
            Speak & Record
          </Button>
        </Box>

        {audioUrl && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={downloadAudio}>
              Download Audio
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TextSpeechRecorder;
