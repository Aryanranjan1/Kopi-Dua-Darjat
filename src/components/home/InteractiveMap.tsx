'use client';

import React from 'react';

const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127484.8231535439!2d101.6868508!3d3.139003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49c701443517%3A0x335b22591e63e2d5!2sKopi%20Dua%20Darjat!5e0!3m2!1sen!2smy!4v1620214533555!5m2!1sen!2smy";

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
