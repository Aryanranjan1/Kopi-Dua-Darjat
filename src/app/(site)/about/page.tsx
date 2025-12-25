
'use client';

import React, { useEffect, useRef } from 'react';

const LivingMosaicGallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current || !containerRef.current) return;
        hasInitialized.current = true;

        const container = containerRef.current;
        
        // --- CONFIGURATION ---
        const totalCols = 5;
        const itemsPerCol = 3;
        const autoPlayInterval = 2500;

        const imageIds = [
            "1493663284031-b7e3aefcae8e", "1506157786151-b8491531f063", "1509631179647-0177331693ae",
            "1515886657613-9f3515b0c78f", "1441986300917-64674bd600d8", "1549880338-65ddcdfd017b",
            "1507525428034-b723cf961d3e", "1486406146926-c627a92ad1ab", "1550614000-4b9519e08137",
            "1479064555552-3ef4979f8908", "1469334031218-e382a71b716b", "1523381210434-271e8be1f52b",
            "1551009175-8a68da93d5f9", "1572276596237-5db2c3e16c5d", "1534528741775-53994a69daeb"
        ];

        let imageIndex = 0;
        let autoPlayTimer: NodeJS.Timeout;
        let isUserInteracting = false;

        // --- 1. BUILD GRID ---
        for (let c = 0; c < totalCols; c++) {
            const col = document.createElement('div');
            col.className = 'col';

            for (let r = 0; r < itemsPerCol; r++) {
                const item = document.createElement('div');
                item.className = 'item';

                const img = document.createElement('img');
                img.src = `https://images.unsplash.com/photo-${imageIds[imageIndex % imageIds.length]}?w=600&q=80`;
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

        container.addEventListener('mouseleave', () => {
            isUserInteracting = false;
            deactivateAll();
            startAutoPlay();
        });

        // --- 2. LOGIC ---
        function activateItem(targetCol: HTMLElement, targetItem: HTMLElement) {
            deactivateAll();
            targetCol.classList.add('active');
            targetItem.classList.add('active');
        }

        function deactivateAll() {
            container.querySelectorAll('.col.active').forEach(el => el.classList.remove('active'));
            container.querySelectorAll('.item.active').forEach(el => el.classList.remove('active'));
        }

        function startAutoPlay() {
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
        }

        // --- 3. INIT ---
        startAutoPlay();

        return () => {
            clearInterval(autoPlayTimer);
            if(container) {
                container.innerHTML = '';
            }
        };
    }, []);

    return (
        <div>
            <style jsx global>{`
                body { 
                    background-color: #000; 
                    font-family: sans-serif;
                    overflow-x: hidden;
                }
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
            <div className="section"><h1>Section Before</h1></div>
            <div className="gallery-container" id="mosaic" ref={containerRef}></div>
            <div className="section"><h1>Section After</h1></div>
        </div>
    );
};

export default LivingMosaicGallery;
