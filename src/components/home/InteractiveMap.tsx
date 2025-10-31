'use client';

import React from 'react';

const mapEmbedUrl = "https://maps.google.com/maps?q=Kopi%20Dua%20Darjat&t=&z=11&ie=UTF8&iwloc=&output=embed";

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
