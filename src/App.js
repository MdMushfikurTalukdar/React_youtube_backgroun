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
import Login from './pages/Login';
import Registration from './pages/Registration';
import FootballCareer from './pages/FootballCareer'; // <- 1. IMPORT THE NEW PAGE
import { GameProvider } from './context/GameContext'; // <- 2. IMPORT THE PROVIDER
import ChatInterface from './pages/ChatInterface'; // Import the new ChatInterface
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import AutoReplySystem from "./pages/AutoReplySystem";
import BanglaAutoReplySystem from "./pages/BanglaAutoReplySystem";
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  useEffect(() => {
    const loadAdScripts = () => {
      try {
        // Create container for 3rd ad FIRST
        const adContainer = document.createElement('div');
        adContainer.id = 'container-461148cde71dd8c3586e2a95af4919d5';
        document.body.appendChild(adContainer);

        // Ad scripts configuration
        const adScripts = [
          //popunder ads
          // {
          //   src: '//pl27451996.profitableratecpm.com/04/9b/58/049b58bb8f039a484550d1e4845528c8.js',
          //   id: 'ad-script-1'
          // },
          {
            src: '//pl27453451.profitableratecpm.com/f0/3a/a0/f03aa033bc9cb942a5fb91344c04656b.js',
            id: 'ad-script-2'
          },
          {
            src: '//pl27453437.profitableratecpm.com/461148cde71dd8c3586e2a95af4919d5/invoke.js',
            id: 'ad-script-3',
            attributes: {
              'async': 'true',
              'data-cfasync': 'false'
            }
          }
        ];

        // Load all scripts with error handling
        adScripts.forEach(({ src, id, attributes }) => {
          if (document.getElementById(id)) return; // Skip if already loaded

          const script = document.createElement('script');
          script.src = src;
          script.id = id;
          script.async = true;

          // Add custom attributes if any
          if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
              script.setAttribute(key, value);
            });
          }

          script.onerror = () => console.error(`Failed to load ad script: ${src}`);
          document.body.appendChild(script);
        });

      } catch (error) {
        console.error('Ad loading error:', error);
      }
    };

    // Delay slightly to ensure DOM is ready
    const timer = setTimeout(loadAdScripts, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    // 3. WRAP EVERYTHING IN GameProvider
    <GameProvider>
      {/* 4. ONLY ONE Router AT THE TOP LEVEL */}
      <AuthProvider> {/* Wrap with AuthProvider */}
        <Router>
            <div className="app-container">
            <Navbar />
            <Routes>
                {/* 5. ALL ROUTES GO HERE, INSIDE THE SINGLE Router */}
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                {/* 6. ADD THE NEW ROUTE FOR THE GAME */}
                <Route path="/football-career" element={<FootballCareer />} />
                <Route path="/chat" element={<ChatInterface />} /> {/* Add chat route */}
                <Route path="/auto" element={
                  <ProtectedRoute>
                    <AutoReplySystem />
                  </ProtectedRoute>
                } />
                <Route path="/bangla-auto" element={<BanglaAutoReplySystem />} />
            </Routes>
            </div>
        </Router>
      </AuthProvider>
    </GameProvider>
  );
}

export default App;