
import React from 'react';
import Image from 'next/image';

export function Logo() {
  return (
    <Image src="/image/kdd-logo-black.svg" alt="Kopi Dua Darjat Logo" width={60} height={60} className="hue-rotate-180 brightness-0 invert" />
  );
}
