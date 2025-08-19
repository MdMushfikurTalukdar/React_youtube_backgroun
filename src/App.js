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
    const loadAdScript = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//pl27451996.profitableratecpm.com/04/9b/58/049b58bb8f039a484550d1e4845528c8.js';
      script.async = true;
      document.body.appendChild(script);
    };

    loadAdScript();
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
          <Route path="/text-to-speech" element={<TextToSpeech />}/>
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