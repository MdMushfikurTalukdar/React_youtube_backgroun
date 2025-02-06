import { Link } from "@mui/material";
import React from "react";

function App() {
  // Function to load the first ad script dynamically
  const loadAdScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//pl25785179.profitablecpmrate.com/38/f3/fd/38f3fd3af54ae11bf25edc4ed6b815d4.js";
    script.async = true;
    document.body.appendChild(script);
  };

  return (
    <div>
      {/* Ad 1: Loads script */}
      <Link component="button" onClick={loadAdScript}>
        <button>Ads 1</button>
      </Link>

      {/* Ad 2: Redirects to the given ad link */}
      <Link href="https://www.profitablecpmrate.com/s0cguj5s5?key=f550db3c8fb7e997a8e06fba664fedbb" target="_blank">
        <button>Ads 2</button>
      </Link>

      {/* Placeholder functions for other ads */}
      <Link component="button" onClick={() => alert("Ad 3 Clicked!")}>
        <button>Ads 3</button>
      </Link>
      <Link component="button" onClick={() => alert("Ad 4 Clicked!")}>
        <button>Ads 4</button>
      </Link>
      <Link component="button" onClick={() => alert("Ad 5 Clicked!")}>
        <button>Ads 5</button>
      </Link>
      <Link component="button" onClick={() => alert("Ad 6 Clicked!")}>
        <button>Ads 6</button>
      </Link>
    </div>
  );
}

export default App;
