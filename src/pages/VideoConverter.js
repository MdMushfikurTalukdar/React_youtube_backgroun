import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Box, Grid, TextField } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const VideoConverter = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [screenshotCount, setScreenshotCount] = useState(0);
  const [screenshotInterval, setScreenshotInterval] = useState(1); // in seconds
  const [screenshots, setScreenshots] = useState([]);
  const [processedScreenshots, setProcessedScreenshots] = useState([]);
  const videoRef = useRef(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotCountChange = (event) => {
    setScreenshotCount(event.target.value);
  };

  const handleScreenshotIntervalChange = (event) => {
    setScreenshotInterval(event.target.value);
  };

  const takeScreenshots = async () => {
    const newScreenshots = [];
    const videoElement = videoRef.current;

    if (videoElement) {
      for (let i = 0; i < screenshotCount; i++) {
        videoElement.currentTime = i * screenshotInterval;

        await new Promise((resolve) => {
          videoElement.onseeked = async () => {
            const canvas = await html2canvas(videoElement);
            newScreenshots.push(canvas.toDataURL('image/png'));
            resolve();
          };
        });
      }
    }

    setScreenshots(newScreenshots);
    setProcessedScreenshots([]); // Reset processed screenshots
  };

  const downloadScreenshots = async () => {
    const zip = new JSZip();
    const folder = zip.folder("screenshots");

    for (let index = 0; index < screenshots.length; index++) {
      const response = await fetch(screenshots[index]);
      const blob = await response.blob();
      folder.file(`screenshot${index + 1}.png`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(content, "screenshots.zip");
  };

  const convertToBlackAndWhite = async () => {
    const newProcessedScreenshots = await Promise.all(screenshots.map((screenshot) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = screenshot;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // Red
            data[i + 1] = avg; // Green
            data[i + 2] = avg; // Blue
          }

          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
      });
    }));

    setProcessedScreenshots(newProcessedScreenshots);
  };

  const sobelOperator = (imageData) => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const sobelData = new Uint8ClampedArray(data.length);

    const kernelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];

    const kernelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const index = ((y + ky) * width + (x + kx)) * 4;
            const brightness = data[index];
            pixelX += brightness * kernelX[ky + 1][kx + 1];
            pixelY += brightness * kernelY[ky + 1][kx + 1];
          }
        }

        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
        const edgeIndex = (y * width + x) * 4;
        sobelData[edgeIndex] = magnitude > 128 ? 255 : 0;
        sobelData[edgeIndex + 1] = sobelData[edgeIndex];
        sobelData[edgeIndex + 2] = sobelData[edgeIndex];
        sobelData[edgeIndex + 3] = 255;
      }
    }

    return new ImageData(sobelData, width, height);
  };

  const convertToLineDrawing = async () => {
    const newProcessedScreenshots = await Promise.all(screenshots.map((screenshot) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = screenshot;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const lineImageData = sobelOperator(imageData);
          ctx.putImageData(lineImageData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
      });
    }));

    setProcessedScreenshots(newProcessedScreenshots);
  };

  const invertColors = async () => {
    const sourceImages = processedScreenshots.length > 0 ? processedScreenshots : screenshots;

    const newProcessedScreenshots = await Promise.all(sourceImages.map((screenshot) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = screenshot;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
          }

          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
      });
    }));

    setProcessedScreenshots(newProcessedScreenshots);
  };

  const downloadProcessedScreenshots = async () => {
    const zip = new JSZip();
    const folder = zip.folder("processed_images");

    for (let index = 0; index < processedScreenshots.length; index++) {
      const response = await fetch(processedScreenshots[index]);
      const blob = await response.blob();
      folder.file(`processed_image${index + 1}.png`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(content, "processed_images.zip");
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Video Converter
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Video
              <input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
            </Button>
          </Box>

          {videoUrl && (
            <Box id="video-container" sx={{ mb: 3 }}>
              <video
                ref={videoRef}
                controls
                src={videoUrl}
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>
          )}

          {videoUrl && (
            <>
              <TextField
                label="Number of Screenshots"
                type="number"
                value={screenshotCount}
                onChange={handleScreenshotCountChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Screenshot Interval (seconds)"
                type="number"
                value={screenshotInterval}
                onChange={handleScreenshotIntervalChange}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button variant="contained" onClick={takeScreenshots}>
                  Take Screenshots
                </Button>
              </Box>
            </>
          )}

          {screenshots.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Screenshots
              </Typography>
              <Grid container spacing={2}>
                {screenshots.map((screenshot, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <img src={screenshot} alt={`Screenshot ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {screenshots.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Button variant="contained" onClick={downloadScreenshots}>
                Download All Screenshots
              </Button>
            </Box>
          )}

          {screenshots.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                onClick={convertToBlackAndWhite}
                sx={{ mr: 2 }}
              >
                Convert to Black and White
              </Button>
              <Button
                variant="contained"
                onClick={convertToLineDrawing}
                sx={{ mr: 2 }}
              >
                Convert to Line Drawing
              </Button>
              <Button variant="contained" onClick={invertColors} startIcon={<InvertColorsIcon />}>
                Invert Colors
              </Button>
            </Box>
          )}

          {processedScreenshots.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Processed Screenshots
              </Typography>
              <Grid container spacing={2}>
                {processedScreenshots.map((screenshot, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <img src={screenshot} alt={`Processed Screenshot ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {processedScreenshots.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Button variant="contained" onClick={downloadProcessedScreenshots}>
                Download Processed Images
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoConverter;