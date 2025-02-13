import React, { useRef, useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Slider,
  Grid,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Upload as UploadIcon,
  InvertColors as InvertColorsIcon,
  Brush as BrushIcon,
  Clear as ClearIcon, // Use Clear icon instead of Eraser
  Download as DownloadIcon,
  Adjust as AdjustIcon,
} from '@mui/icons-material';

const ImageConverter = () => {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [tool, setTool] = useState('pencil');
  const [pencilSize, setPencilSize] = useState(5);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load image onto canvas
  useEffect(() => {
    if (imageUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
      };
    }
  }, [imageUrl]);

  // Convert image to black and white
  const convertToBlackAndWhite = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Sobel operator for edge detection
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

  // Convert to line drawing using Sobel operator
  const convertToLineDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const lineImageData = sobelOperator(imageData);
    ctx.putImageData(lineImageData, 0, 0);
  };

  // Invert colors of the line drawing
  const invertColors = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Handle drawing
  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.lineWidth = pencilSize;
    ctx.strokeStyle = tool === 'eraser' ? 'white' : 'black';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Adjust brightness and contrast
  const adjustBrightnessContrast = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * (brightness / 100);
      data[i + 1] = data[i + 1] * (brightness / 100);
      data[i + 2] = data[i + 2] * (brightness / 100);

      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      data[i] = factor * (data[i] - 128) + 128;
      data[i + 1] = factor * (data[i + 1] - 128) + 128;
      data[i + 2] = factor * (data[i + 2] - 128) + 128;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Resize the canvas to common dimensions
  const resizeCanvas = (width, height) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
    };
  };

  // Download the canvas image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'canvas-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Image Converter
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
          </Box>

          {imageUrl && (
            <Box>
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

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Adjust Brightness and Contrast
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>Brightness: {brightness}%</Typography>
                    <Slider
                      value={brightness}
                      min={0}
                      max={200}
                      onChange={(e, value) => setBrightness(value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>Contrast: {contrast}%</Typography>
                    <Slider
                      value={contrast}
                      min={0}
                      max={200}
                      onChange={(e, value) => setContrast(value)}
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  onClick={adjustBrightnessContrast}
                  startIcon={<AdjustIcon />}
                  sx={{ mt: 2 }}
                >
                  Apply Adjustments
                </Button>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Drawing Tools
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Tooltip title="Pencil">
                    <IconButton
                      color={tool === 'pencil' ? 'primary' : 'default'}
                      onClick={() => setTool('pencil')}
                    >
                      <BrushIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eraser">
                    <IconButton
                      color={tool === 'eraser' ? 'primary' : 'default'}
                      onClick={() => setTool('eraser')}
                    >
                      <ClearIcon /> {/* Use Clear icon instead of Eraser */}
                    </IconButton>
                  </Tooltip>
                  <Typography>Pencil Size: {pencilSize}</Typography>
                  <Slider
                    value={pencilSize}
                    min={1}
                    max={20}
                    onChange={(e, value) => setPencilSize(value)}
                    sx={{ width: 100 }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Resize Image
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" onClick={() => resizeCanvas(300, 300)}>
                    300x300
                  </Button>
                  <Button variant="contained" onClick={() => resizeCanvas(600, 600)}>
                    600x600
                  </Button>
                  <Button variant="contained" onClick={() => resizeCanvas(800, 800)}>
                    800x800
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={downloadImage}
                  startIcon={<DownloadIcon />}
                >
                  Download Image
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <canvas
                  ref={canvasRef}
                  style={{
                    border: '1px solid #000',
                    cursor: 'crosshair',
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                />
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ImageConverter;