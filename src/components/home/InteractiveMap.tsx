'use client';

import React from 'react';

const mapEmbedUrl = "https://www.google.com/maps/embed/v1/search?q=Kopi+Dua+Darjat";

export default function InteractiveMap() {
  return (
    <iframe
      width="100%"
      height="100%"
      style={{ border: 0 }}
      src={mapEmbedUrl}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    >
    </iframe>
  );
}
