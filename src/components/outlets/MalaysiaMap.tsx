
'use client';

import { MapPin } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

const regionData = [
    { name: 'KL & Selangor', count: '20+', position: { top: '55%', left: '20%' } },
    { name: 'Penang', count: '10+', position: { top: '30%', left: '15%' } },
    { name: 'Johor', count: '8+', position: { top: '75%', left: '28%' } },
    { name: 'East Coast', count: '5+', position: { top: '45%', left: '45%' } },
    { name: 'Sabah & Sarawak', count: '7+', position: { top: '60%', left: '75%' } },
]

const RegionPin = ({ name, count, position }: typeof regionData[0]) => (
    <div className="absolute" style={position}>
        <div className="relative group">
            <MapPin className="w-10 h-10 text-primary drop-shadow-lg transition-transform group-hover:scale-125" />
            <div className="absolute bottom-full mb-2 w-40 p-2 bg-black text-white text-center rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-1/2 left-1/2">
                <p className="font-bold">{name}</p>
                <p className="text-primary font-semibold">{count} Outlets</p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black"></div>
            </div>
        </div>
    </div>
);


export default function MalaysiaMap() {
    return (
        <section className="py-24 sm:py-32 bg-black text-white">
            <div className="container mx-auto px-6">
                <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">
                        Our Presence Across Malaysia
                    </h2>
                    <p className="mt-4 text-lg text-white/80">
                        From humble beginnings to 50+ outlets nationwide — Kopi Dua Darjat is serving Malaysia one cup at a time.
                    </p>
                </AnimateOnScroll>
                
                <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-16 relative max-w-4xl mx-auto aspect-[4/3]">
                    <svg viewBox="0 0 400 300" className="w-full h-full opacity-20">
                        {/* A very simplified Malaysia map silhouette */}
                        {/* Peninsular Malaysia */}
                        <path d="M100,50 Q110,30 130,40 L150,80 Q160,120 140,160 L130,220 Q120,260 90,250 L80,200 Q70,150 80,100 Z" fill="hsl(var(--primary))" />
                        {/* Sarawak */}
                        <path d="M180,180 L250,150 L280,200 L200,240 Z" fill="hsl(var(--primary))" />
                        {/* Sabah */}
                        <path d="M280,100 L350,80 L360,140 L300,160 Z" fill="hsl(var(--primary))" />
                    </svg>

                    {regionData.map(region => (
                        <RegionPin key={region.name} {...region} />
                    ))}
                </AnimateOnScroll>
            </div>
        </section>
    );
}
