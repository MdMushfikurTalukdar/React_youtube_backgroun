import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import ytdl from 'ytdl-core-browser';

const DownloadVideo = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);

  const transformShortsUrl = (url) => {
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('/shorts/')[1].split('?')[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return url;
  };

  const handleDownload = async () => {
    if (!videoUrl) {
      setError('Please enter a video URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoInfo(null);

    try {
      const transformedUrl = transformShortsUrl(videoUrl);
      
      if (!ytdl.validateURL(transformedUrl)) {
        throw new Error('Invalid YouTube URL');
      }

      const info = await ytdl.getInfo(transformedUrl);
      setVideoInfo({
        title: info.videoDetails.title,
        duration: info.videoDetails.lengthSeconds,
      });

      const format = ytdl.chooseFormat(info.formats, { 
        quality: 'highest',
        filter: 'audioandvideo'
      });

      if (!format) {
        throw new Error('No downloadable format found');
      }

      const stream = ytdl(transformedUrl, { format });
      const chunks = [];
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const blob = new Blob(chunks, { type: format.mimeType });
      saveAs(blob, `${info.videoDetails.title.replace(/[^\w\s]/gi, '')}.mp4`);

    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'Download failed. Try a different video or check console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>YouTube Video Downloader</h1>
      
      <div style={{ 
        background: '#fff', 
        borderRadius: '8px', 
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Paste YouTube Video URL (Shorts or Regular):
          </label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/shorts/... or https://youtube.com/watch?v=..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <button
          onClick={handleDownload}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            background: isLoading ? '#4a8cff' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Downloading...' : 'Download Video'}
        </button>

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            borderRadius: '4px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {videoInfo && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc' }}>
            <h2>Video Information</h2>
            <p><strong>Title:</strong> {videoInfo.title}</p>
            <p><strong>Duration:</strong> {Math.floor(videoInfo.duration / 60)}m {videoInfo.duration % 60}s</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center', color: '#64748b' }}>
        <p>Works with YouTube videos and Shorts</p>
        <p style={{ fontSize: '0.9em' }}>Note: Some videos may be restricted by YouTube</p>
      </div>
    </div>
  );
};

export default DownloadVideo;