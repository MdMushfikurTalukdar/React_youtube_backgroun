import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Homepage from "./pages/Homepage";
import FunDashboard from "./pages/FunDashboard";
import ImageConverter from './pages/ImageConverter';
import VideoConverter from './pages/VideoConverter';
import MusicMaker from './pages/MusicMaker';
import TextToSpeech from './pages/TextToSpeech';
import DownloadVideo from './pages/DownloadVideo';
import InstagramDownloader from './pages/InstagramDownloader';
import AutoReply from './pages/AutoReply';
import BlogPage from './pages/BlogPage';

function App() {
  useEffect(() => {
    const loadAdScripts = () => {
      // Ad 1 (Original)
      const script1 = document.createElement('script');
      script1.src = '//pl27451996.profitableratecpm.com/04/9b/58/049b58bb8f039a484550d1e4845528c8.js';
      script1.async = true;

      // Ad 2 (Second Ad)
      const script2 = document.createElement('script');
      script2.src = '//pl27453451.profitableratecpm.com/f0/3a/a0/f03aa033bc9cb942a5fb91344c04656b.js';
      script2.async = true;

      // Ad 3 (Third Ad - with container)
      const script3 = document.createElement('script');
      script3.src = '//pl27453437.profitableratecpm.com/461148cde71dd8c3586e2a95af4919d5/invoke.js';
      script3.async = true;
      script3.dataset.cfasync = "false"; // Required for this ad

      // Append all scripts
      document.body.appendChild(script1);
      document.body.appendChild(script2);
      document.body.appendChild(script3);

      // Create container for Ad 3
      const adContainer = document.createElement('div');
      adContainer.id = 'container-461148cde71dd8c3586e2a95af4919d5';
      document.body.appendChild(adContainer);
    };

    loadAdScripts();
  }, []);

  return (
    <Router>
      <div>
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/fun" element={<FunDashboard />} />
          <Route path="/image-converter" element={<ImageConverter />} />
          <Route path="/video-converter" element={<VideoConverter />} />
          <Route path="/music-maker" element={<MusicMaker />} />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
          <Route path="/download-video" element={<DownloadVideo />} />
          <Route path="/instagram-downloader" element={<InstagramDownloader />} />
          <Route path="/auto-reply" element={<AutoReply />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;