import React from 'react';
import AntigravityCanvas from '@/components/AntigravityCanvas';

export default function CanvasPreviewPage() {
  return (
    <div className="w-full h-screen">
      <AntigravityCanvas 
        vibe="roast" 
        headline="Happy 27th!"
        body="Scientists confirm you are officially too old to ever be considered a child prodigy. Please stop telling people you’re 'still in your twenties' as if you aren’t 98% of the way to 30. Enjoy the cold pizza you left out last night."
        senderAlias="Anonymous Roast Committee"
      />
    </div>
  );
}
