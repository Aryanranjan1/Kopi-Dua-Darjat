
'use client';

import type { Outlet } from '@/lib/types';
import Image from 'next/image';

interface MicrositeHeroProps {
  outlet: Outlet;
}

export default function MicrositeHero({ outlet }: MicrositeHeroProps) {
  const heroImageUrl = "https://lh3.googleusercontent.com/p/AF1QipPN12db8DKjb9jFg8lHFguXVNf7TbsrIug8BwE6=w426-h240-k-no";
  
  return (
    <section id="home" className="relative w-full h-screen bg-zinc-900">
      {heroImageUrl ? (
        <Image
          src={heroImageUrl}
          alt={outlet.name}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-white">No hero image available for this outlet.</p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none -mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f7f4ef" fillOpacity="1" d="M0,192L10.4,170.7C20.9,149,42,107,63,90.7C83.5,75,104,85,125,122.7C146.1,160,167,224,188,218.7C208.7,213,230,139,250,133.3C271.3,128,292,192,313,229.3C333.9,267,355,277,376,282.7C396.5,288,417,288,438,261.3C459.1,235,480,181,501,181.3C521.7,181,543,235,563,240C584.3,245,605,203,626,165.3C647,128,668,96,689,96C709.6,96,730,128,751,160C772.2,192,793,224,814,202.7C834.8,181,856,107,877,117.3C897.4,128,918,224,939,245.3C960,267,981,213,1002,186.7C1022.6,160,1043,160,1064,144C1085.2,128,1106,96,1127,96C1147.8,96,1169,128,1190,133.3C1210.4,139,1231,117,1252,117.3C1273,117,1294,139,1315,170.7C1335.7,203,1357,245,1377,229.3C1398.3,213,1419,139,1430,101.3L1440,64L1440,320L1429.6,320C1419.1,320,1398,320,1377,320C1356.5,320,1336,320,1315,320C1293.9,320,1273,320,1252,320C1231.3,320,1210,320,1190,320C1168.7,320,1148,320,1127,320C1106.1,320,1085,320,1064,320C1043.5,320,1023,320,1002,320C980.9,320,960,320,939,320C918.3,320,897,320,877,320C855.7,320,835,320,814,320C793,320,772,320,751,320C730.4,320,710,320,689,320C667.8,320,647,320,626,320C605.2,320,584,320,563,320C542.6,320,522,320,501,320C480,320,459,320,438,320C417.4,320,397,320,376,320C354.8,320,334,320,313,320C292.2,320,271,320,250,320C229.6,320,209,320,188,320C167,320,146,320,125,320C104.3,320,83,320,63,320C41.7,320,21,320,10,320L0,320Z"></path></svg>
      </div>
    </section>
  );
}
