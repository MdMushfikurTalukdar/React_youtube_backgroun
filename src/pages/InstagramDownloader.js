// App.js
import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';

const InstagramDownloader = () => {
  const [postUrl, setPostUrl] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thumbnail, setThumbnail] = useState('');

  // Extract shortcode from Instagram URL
  const extractShortcode = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([^\/\?\&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Load Pyodide when the app starts
  useEffect(() => {
    const loadPyodide = async () => {
      const pyodideInstance = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/" });
      await pyodideInstance.loadPackage(['micropip']);
      await pyodideInstance.runPythonAsync(`
        import micropip
        await micropip.install("httpx")
      `);
      setPyodide(pyodideInstance);
    };

    loadPyodide();
  }, []);

  // Main download logic
  const handleDownload = async () => {
    setError(null);
    setThumbnail('');
    setIsLoading(true);

    const shortcode = extractShortcode(postUrl);
    if (!shortcode) {
      setError('Invalid Instagram URL');
      setIsLoading(false);
      return;
    }

    try {
const pythonCode = `
from pyodide.http import pyfetch
import json

headers = {
    "User-Agent": "Mozilla/5.0"
}
url = f"https://www.instagram.com/reel/${shortcode}/?__a=1&__d=dis"

response = await pyfetch(url, method="GET", headers=headers)
text = await response.string()
data = json.loads(text)

media = data["graphql"]["shortcode_media"]
video_url = media.get("video_url")
thumb_url = media.get("display_url")

json.dumps({
    "video_url": video_url,
    "thumb_url": thumb_url
})
`;

      const result = await pyodide.runPythonAsync(pythonCode);
      const { video_url, thumb_url, error: pyError } = JSON.parse(result);

      if (pyError || !video_url) {
        throw new Error(pyError || 'Video URL not found.');
      }

      setThumbnail(thumb_url);

      const videoBlob = await fetch(video_url).then((r) => r.blob());
      saveAs(videoBlob, `instagram_${shortcode}.mp4`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Instagram Reel Downloader (Frontend Only)</h1>

      <div style={styles.card}>
        <input
          type="text"
          placeholder="Paste Instagram Reel URL"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleDownload}
          disabled={isLoading || !pyodide}
          style={isLoading ? styles.buttonDisabled : styles.button}
        >
          {isLoading ? 'Downloading...' : 'Download Video'}
        </button>

        {thumbnail && (
          <div style={styles.thumbnailContainer}>
            <img src={thumbnail} alt="Video thumbnail" style={styles.thumbnail} />
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center'
  },
  title: {
    marginBottom: '20px',
    color: '#333'
  },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#E1306C',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  buttonDisabled: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#aaa',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  },
  thumbnailContainer: {
    marginTop: '20px'
  },
  thumbnail: {
    maxWidth: '100%',
    borderRadius: '8px'
  },
  error: {
    marginTop: '20px',
    color: 'red'
  }
};

export default InstagramDownloader;
