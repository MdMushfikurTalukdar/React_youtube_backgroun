import React, { useRef, useState, useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import UploadIcon from "@mui/icons-material/Upload";
import StopIcon from "@mui/icons-material/Stop";
import * as faceapi from "face-api.js";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs"; // Import TensorFlow.js

const FunDashboard = () => {
  const [image, setImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [objectDetected, setObjectDetected] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cocoModel, setCocoModel] = useState(null);

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setModelsLoaded(true);
        console.log("Face models loaded successfully!");

        // Load COCO-SSD model for object detection
        const model = await cocoSsd.load();
        setCocoModel(model);
        console.log("COCO-SSD model loaded successfully!");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // Corrected line
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Capture an image from the camera
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/png"));
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Detect faces in the image
  const detectFaces = async () => {
    if (!image) {
      alert("Please capture or upload an image first.");
      return;
    }

    if (!modelsLoaded) {
      alert("Models are still loading. Please wait.");
      return;
    }

    try {
      console.log("Detecting faces...");
      const img = await faceapi.fetchImage(image);
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());

      if (detections.length > 0) {
        setFaceDetected("Face Detected!");
      } else {
        setFaceDetected("No Face Detected.");
      }
    } catch (error) {
      console.error("Error detecting faces:", error);
      setFaceDetected("Error detecting faces.");
    }
  };

  // Detect objects in the image
  const detectObjects = async () => {
    if (!image || !cocoModel) {
      alert("Please capture or upload an image first and ensure the model is loaded.");
      return;
    }

    const img = document.createElement("img");
    img.src = image;
    img.style.display = "none"; // Hide the image element
    document.body.appendChild(img); // Append to DOM for detection

    img.onload = async () => {
      try {
        const predictions = await cocoModel.detect(img);
        console.log("Object detections:", predictions);
        setObjectDetected(predictions);
      } catch (error) {
        console.error("Error detecting objects:", error);
        setObjectDetected([]);
      } finally {
        document.body.removeChild(img); // Clean up the image element
      }
    };
  };

  return (
    <Container sx={{ textAlign: "center", marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fun Dashboard
      </Typography>

      {/* Camera Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Capture or Upload an Image
        </Typography>
        <video ref={videoRef} autoPlay style={{ width: "100%", maxWidth: "400px" }}></video>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>
          {isCameraActive ? (
            <Button
              variant="contained"
              startIcon={<StopIcon />}
              onClick={stopCamera}
              color="error"
            >
              Stop Camera
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<CameraAltIcon />}
              onClick={startCamera}
            >
              Start Camera
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<CameraAltIcon />}
            onClick={captureImage}
            disabled={!isCameraActive}
          >
            Capture Image
          </Button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current.click()}
          >
            Upload Image
          </Button>
        </Box>
      </Box>

      {/* Display Captured/Uploaded Image */}
      {image && (
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Image
          </Typography>
          <img src={image} alt="Captured/Uploaded" style={{ width: "100%", maxWidth: "400px" }} />
        </Box>
      )}

      {/* Face Detection Result */}
      {faceDetected && (
        <Typography variant="h6" gutterBottom>
          {faceDetected}
        </Typography>
      )}

      {/* Object Detection Result */}
      {objectDetected && (
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>
            Object Detection Results:
          </Typography>
          <ul>
            {objectDetected.map((obj, index) => (
              <li key={index}>
                {obj.class} - {Math.round(obj.score * 100)}%
              </li>
            ))}
          </ul>
        </Box>
      )}

      {/* Fun Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={detectObjects}>
          Detect Objects
        </Button>
        <Button variant="contained" color="secondary" onClick={detectFaces}>
          Detect Faces
        </Button>
      </Box>
    </Container>
  );
};

export default FunDashboard;