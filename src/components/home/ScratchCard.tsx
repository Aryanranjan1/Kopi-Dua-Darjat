'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Gift, Copy, Check } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

type Prize = {
  prize: string;
  promoCode: string;
};

type ScratchCardProps = {
  prizes: Prize[];
};

export const ScratchCard = ({ prizes }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [revealedPrize, setRevealedPrize] = useState<Prize | null>(null);

  const { width, height } = useWindowSize();

  const getTodayString = () => {
    const today = new Date();
    return today.toDateString();
  };

  useEffect(() => {
    const lastPlayed = localStorage.getItem('kopi_last_played');
    const today = getTodayString();
    if (lastPlayed === today) {
      setCanPlay(false);
      const storedPrize = localStorage.getItem('kopi_prize');
      if (storedPrize) {
        setRevealedPrize(JSON.parse(storedPrize));
        setIsRevealed(true);
        setIsScratched(true);
      }
    } else {
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setRevealedPrize(prize);
    }
  }, [prizes]);

  const drawScratchOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Ensure high-DPI display
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Silver foil gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(0.2, '#d9d9d9');
    gradient.addColorStop(0.5, '#b0b0b0');
    gradient.addColorStop(0.8, '#e0e0e0');
    gradient.addColorStop(1, '#a0a0a0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  useEffect(() => {
    if (!isScratched && canPlay) {
      drawScratchOverlay();
    }
  }, [drawScratchOverlay, isScratched, canPlay]);

  const scratch = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI, true);
    ctx.fill();
    checkReveal(ctx);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    scratch(ctx, x, y);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    scratch(ctx, x, y);
  };


  const checkReveal = (ctx: CanvasRenderingContext2D) => {
    if (!ctx.canvas) return;
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const pixels = imageData.data;
    const transparentPixels = Array.from(pixels).filter((_, i) => (i + 1) % 4 === 0).filter(p => p === 0).length;
    const totalPixels = ctx.canvas.width * ctx.canvas.height;

    if (transparentPixels / totalPixels > 0.6) {
      setIsRevealed(true);
      setShowConfetti(true);
      setIsScratched(true);
      localStorage.setItem('kopi_last_played', getTodayString());
      localStorage.setItem('kopi_prize', JSON.stringify(revealedPrize));
    }
  };

  const handleCopy = () => {
    if (revealedPrize?.promoCode) {
      navigator.clipboard.writeText(revealedPrize.promoCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div
      className="relative w-full max-w-md aspect-[1.6/1] rounded-2xl shadow-2xl p-6 bg-card text-card-foreground flex flex-col items-center justify-center overflow-hidden"
      style={{ 
        backgroundImage: 'url("/img/noise-bg.png")', 
        backgroundSize: 'cover'
        }}
    >
      {showConfetti && <Confetti width={width} height={height} recycle={false} onConfettiComplete={() => setShowConfetti(false)}/>}
      
      {!canPlay && !isScratched ? (
        <div className="text-center">
            <h3 className="font-headline text-2xl text-primary">Already Scratched!</h3>
            <p className="mt-2 text-muted-foreground">You've already played today.</p>
            <p className="mt-4 font-bold text-accent">"Come back tomorrow for another reward!"</p>
        </div>
      ) : (
        <>
            {/* Prize Layer */}
            <div
                className={cn(
                'absolute inset-0 flex flex-col items-center justify-center text-center p-4 transition-opacity duration-500',
                isRevealed ? 'opacity-100' : 'opacity-0'
                )}
            >
                <Gift className="w-12 h-12 text-accent" />
                <h3 className="mt-4 font-headline text-3xl font-bold text-primary">
                {revealedPrize?.prize}
                </h3>
                <div className="mt-6 flex items-center gap-2">
                <div className="border-2 border-dashed border-accent/50 rounded-lg px-4 py-2">
                    <p className="font-mono text-2xl font-bold text-accent tracking-widest">
                    {revealedPrize?.promoCode}
                    </p>
                </div>
                <Button onClick={handleCopy} size="icon" variant="ghost">
                    {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
                </div>
                <Button className="mt-6" size="lg">Redeem Now</Button>
                <p className="text-xs text-muted-foreground mt-4">"Come back tomorrow for another reward!"</p>
            </div>

            {/* Scratch Layer */}
            {!isScratched && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair rounded-2xl"
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                />
            )}
        </>
      )}

      {!canPlay && isScratched && (
          <div className="text-center">
            <Gift className="w-12 h-12 text-accent mx-auto" />
             <h3 className="mt-4 font-headline text-3xl font-bold text-primary">
                {revealedPrize?.prize}
             </h3>
             <p className="mt-2 text-muted-foreground">Your code for today:</p>
             <div className="mt-4 flex items-center gap-2 justify-center">
                <div className="border-2 border-dashed border-accent/50 rounded-lg px-4 py-2">
                    <p className="font-mono text-2xl font-bold text-accent tracking-widest">
                    {revealedPrize?.promoCode}
                    </p>
                </div>
                <Button onClick={handleCopy} size="icon" variant="ghost">
                    {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
             </div>
             <p className="text-xs text-muted-foreground mt-4">"Come back tomorrow for another reward!"</p>
          </div>
      )}
    </div>
  );
};
