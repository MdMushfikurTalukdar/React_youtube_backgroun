import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const DownloadVideo = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractVideoId = (url) => {
    // Handle regular YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    // Handle YouTube Shorts URLs
    if (url.includes('youtube.com/shorts/')) {
      return url.split('/shorts/')[1].split('?')[0];
    }
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleDownload = async () => {
    if (!videoUrl) {
      setError('Please enter a video URL');
      return;
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setError('Invalid YouTube URL format');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Using a proxy service that handles Shorts
      const proxyUrl = `https://yt-downloader-proxy.vercel.app/api/download?id=${videoId}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(response.status === 404 
          ? 'Video not found or restricted' 
          : 'Failed to fetch video');
      }

      const blob = await response.blob();
      saveAs(blob, `youtube_video_${videoId}.mp4`);

    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download. Please try a different video.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>YouTube Video Downloader</h1>
      
      <div style={styles.card}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Paste YouTube URL (Shorts or Regular):</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
            style={styles.input}
          />
        </div>

        <button
          onClick={handleDownload}
          disabled={isLoading}
          style={isLoading ? styles.buttonDisabled : styles.button}
        >
          {isLoading ? 'Downloading...' : 'Download Video'}
        </button>

        {error && (
          <div style={styles.error}>
            <strong>Error:</strong> {error}
            <div style={styles.tips}>
              <p>Try these solutions:</p>
              <ol>
                <li>Check if URL is correct</li>
                <li>Try a different video</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  card: {
    background: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  inputContainer: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  buttonDisabled: {
    width: '100%',
    padding: '12px',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'not-allowed'
  },
  error: {
    marginTop: '20px',
    padding: '15px',
    background: '#ffebee',
    border: '1px solid #ffcdd2',
    color: '#d32f2f',
    borderRadius: '4px'
  },
  tips: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#666'
  }
};

export default DownloadVideo;