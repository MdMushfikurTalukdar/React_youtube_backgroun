import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

const Recorder2 = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const mediaStreamDestinationRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    mediaStreamDestinationRef.current =
      audioContextRef.current.createMediaStreamDestination();
  }, []);

  const startRecording = () => {
    if (!mediaStreamDestinationRef.current) {
      alert("Audio context is not initialized.");
      return;
    }

    audioChunksRef.current = [];
    const mediaStream = mediaStreamDestinationRef.current.stream;
    mediaRecorderRef.current = new MediaRecorder(mediaStream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
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

  const speakText = (text) => {
    if (!text) {
      alert("Enter some text first.");
      return;
    }

    if (!window.speechSynthesis) {
      alert("Speech synthesis not supported.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const source = audioContextRef.current.createMediaStreamSource(
      mediaStreamDestinationRef.current.stream
    );

    source.connect(audioContextRef.current.destination);
    startRecording();

    utterance.onend = () => {
      stopRecording();
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<PlayArrowIcon />}
        onClick={() => speakText("This is a test recording.")}
        disabled={isRecording}
      >
        Speak & Record
      </Button>

      {isRecording && (
        <Button variant="contained" startIcon={<StopIcon />} onClick={stopRecording}>
          Stop Recording
        </Button>
      )}

      {audioUrl && (
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => {
            const link = document.createElement("a");
            link.href = audioUrl;
            link.download = "recorded_speech.wav";
            link.click();
          }}
        >
          Download Audio
        </Button>
      )}
    </div>
  );
};

export default Recorder2;
