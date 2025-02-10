import { Link } from "@mui/material";
import React, { useEffect } from "react";
import Button from '@mui/material/Button'; // <-- Added this import

// YouTube Button Component
const YoutubeButton = () => { // <-- Added this component
  const handleClick = () => {
    // Open YouTube in a new tab
    window.open('https://www.youtube.com', '_blank');
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleClick}
      startIcon={
        <img
          src="https://www.youtube.com/favicon.ico"
          alt="YouTube Icon"
          style={{ width: '24px', height: '24px' }}
        />
      }
    >
      YouTube
    </Button>
  );
};

function App() {
  // Function to load a script dynamically
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  };

  // Load the ad scripts when the component mounts
  useEffect(() => {
    const loadAds = async () => {
      try {
        await loadScript("//pl25785179.profitablecpmrate.com/38/f3/fd/38f3fd3af54ae11bf25edc4ed6b815d4.js");
        await loadScript("//pl25812099.effectiveratecpm.com/53/4a/e4/534ae4b2b85725a6a295ee6f0edf9027.js");
        await loadScript("//pl25785213.effectiveratecpm.com/e28dc6067e4236563bbed735b8ab040c/invoke.js");

        // Set up the ad options
        const adOptionsScript = document.createElement("script");
        adOptionsScript.type = "text/javascript";
        adOptionsScript.innerHTML = `
          atOptions = {
            'key' : 'e42d2be4c4faa9a29246561df49c6bc3',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
          };
        `;
        document.body.appendChild(adOptionsScript);

        // Load the ad options invoke script
        await loadScript("//www.highperformanceformat.com/e42d2be4c4faa9a29246561df49c6bc3/invoke.js");
      } catch (error) {
        console.error(error);
      }
    };

    loadAds();
  }, []);

  return (
    <div>
      {/* Ad Scripts */}
      <script async="async" data-cfasync="false" src="//pl25785213.effectiveratecpm.com/e28dc6067e4236563bbed735b8ab040c/invoke.js"></script>
      <div id="container-e28dc6067e4236563bbed735b8ab040c"></div>

      {/* Ad 1: Loads script */}
      <Link component="button" onClick={() => alert("Ad 1 Clicked!")}>
        <button>Ads 1</button>
      </Link>

      {/* Ad 2: Redirects to the given ad link */}
      <Link href="https://www.profitablecpmrate.com/s0cguj5s5?key=f550db3c8fb7e997a8e06fba664fedbb" target="_blank">
        <button>Ads 2</button>
      </Link>

      {/* YouTube Button */}
      <YoutubeButton /> {/* <-- Added this line */}
    </div>
  );
}

export default App;