
'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useMedia } from '@/lib/media';
import { Skeleton } from '@/components/ui/skeleton';

const LivingMosaicGallery = () => {
    const { data: media, isLoading } = useMedia();
    const containerRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    const galleryImages = useMemo(() => {
        if (!media) return [];
        return media.filter(m => m.id.startsWith('gallery-')).map(m => m.imageUrl);
    }, [media]);

    useEffect(() => {
        if (isLoading || galleryImages.length === 0 || hasInitialized.current || !containerRef.current) return;
        hasInitialized.current = true;

        const container = containerRef.current;
        container.innerHTML = ''; // Clear previous content

        const totalCols = 5;
        const itemsPerCol = 3;
        const autoPlayInterval = 2500;

        let imageIndex = 0;
        let autoPlayTimer: NodeJS.Timeout;
        let isUserInteracting = false;

        for (let c = 0; c < totalCols; c++) {
            const col = document.createElement('div');
            col.className = 'col';

            for (let r = 0; r < itemsPerCol; r++) {
                const item = document.createElement('div');
                item.className = 'item';

                const img = document.createElement('img');
                img.src = galleryImages[imageIndex % galleryImages.length];
                item.appendChild(img);

                item.addEventListener('mouseenter', () => {
                    isUserInteracting = true;
                    activateItem(col, item);
                    clearInterval(autoPlayTimer);
                });

                col.appendChild(item);
                imageIndex++;
            }

            container.appendChild(col);
        }

        const deactivateAll = () => {
            container.querySelectorAll('.col.active').forEach(el => el.classList.remove('active'));
            container.querySelectorAll('.item.active').forEach(el => el.classList.remove('active'));
        };
        
        const activateItem = (targetCol: HTMLElement, targetItem: HTMLElement) => {
            deactivateAll();
            targetCol.classList.add('active');
            targetItem.classList.add('active');
        };

        const startAutoPlay = () => {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                if (isUserInteracting) return;

                const cols = container.querySelectorAll('.col');
                const randColIndex = Math.floor(Math.random() * cols.length);
                const randCol = cols[randColIndex] as HTMLElement;

                const items = randCol.querySelectorAll('.item');
                const randItemIndex = Math.floor(Math.random() * items.length);
                const randItem = items[randItemIndex] as HTMLElement;

                activateItem(randCol, randItem);
            }, autoPlayInterval);
        };

        container.addEventListener('mouseleave', () => {
            isUserInteracting = false;
            deactivateAll();
            startAutoPlay();
        });

        startAutoPlay();

        return () => {
            clearInterval(autoPlayTimer);
            if (container) {
                container.innerHTML = '';
            }
            hasInitialized.current = false;
        };
    }, [isLoading, galleryImages]);
    
    if (isLoading) {
        return <Skeleton className="w-full h-screen" />;
    }

    return (
        <div className="bg-black">
            <style jsx global>{`
                .section {
                    height: 60vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #111;
                    color: #444;
                    border-bottom: 1px solid #222;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .gallery-container {
                    height: 100vh; 
                    width: 100%;
                    background: #000;
                    display: flex;
                    overflow: hidden;
                }
                .col {
                    flex: 1;
                    display: flex; 
                    flex-direction: column;
                    transition: flex 1.2s cubic-bezier(0.25, 1, 0.5, 1);
                }
                .item {
                    position: relative;
                    flex: 1;
                    overflow: hidden;
                    transition: flex 1.2s cubic-bezier(0.25, 1, 0.5, 1);
                    border: 1px solid #000;
                }
                .item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: grayscale(100%) brightness(0.6);
                    transition: transform 1.5s ease, filter 1s ease;
                }
                .col.active {
                    flex: 3;
                }
                .item.active {
                    flex: 3;
                }
                .item.active img {
                    filter: grayscale(0%) brightness(1.1);
                    transform: scale(1.1);
                }
                @media (max-width: 768px) {
                    .gallery-container { flex-direction: column; height: auto; }
                    .col { flex-direction: row; height: 20vh; }
                    .col.active, .item.active { flex: 1; }
                }
            `}</style>
            <div className="section"><h1>Our Gallery</h1></div>
            <div className="gallery-container" id="mosaic" ref={containerRef}></div>
        </div>
    );
};

export default LivingMosaicGallery;
