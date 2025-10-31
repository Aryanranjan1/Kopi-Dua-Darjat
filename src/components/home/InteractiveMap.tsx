'use client';

import React from 'react';

const mapEmbedUrl = "https://www.google.com/maps/embed/v1/search?q=Kopi%20Dua%20Darjat&key=" + (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '');

export default function InteractiveMap() {
  return (
    <iframe
      width="100%"
      height="100%"
      style={{ border: 0 }}
      src={mapEmbedUrl}
      allowFullScreen
    >
    </iframe>
  );
}
