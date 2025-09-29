'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const SteamingCoffeeCup = () => (
  <div className="relative w-16 h-16 sm:w-20 sm:h-20">
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M52 38H12C9.79086 38 8 36.2091 8 34V20C8 17.7909 9.79086 16 12 16H52C54.2091 16 56 17.7909 56 20V34C56 36.2091 54.2091 38 52 38Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56 24H60C61.1046 24 62 24.8954 62 26V30C62 31.1046 61.1046 32 60 32H56"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 8C20 8 22 4 24 4C26 4 27 7 26 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[steam_3s_linear_infinite]"
        style={{ transformOrigin: '50% 50%', animationDelay: '0s' }}
      />
      <path
        d="M32 10C32 10 34 6 36 6C38 6 39 9 38 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[steam_3s_linear_infinite]"
        style={{ transformOrigin: '50% 50%', animationDelay: '1s' }}
      />
      <path
        d="M44 8C44 8 46 4 48 4C50 4 51 7 50 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[steam_3s_linear_infinite]"
        style={{ transformOrigin: '50% 50%', animationDelay: '2s' }}
      />
    </svg>
    <style jsx>{`
      @keyframes steam {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        70% {
          transform: translateY(-12px) scale(1.2);
          opacity: 0.5;
        }
        100% {
          transform: translateY(-18px) scale(1.4);
          opacity: 0;
        }
      }
    `}</style>
  </div>
);

const calculateTimeLeft = () => {
  const now = new Date();
  const morningRushEnd = new Date(now);
  morningRushEnd.setHours(11, 0, 0, 0);

  let difference = morningRushEnd.getTime() - now.getTime();

  if (difference < 0) {
    return null;
  }

  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
};

const TimerDisplay = ({ time, label }: { time: string; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="text-2xl sm:text-3xl font-bold font-mono text-primary bg-background/50 rounded-lg px-2 py-1 shadow-inner animate-pulse-light">
      {time}
    </div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export const MorningRushBanner = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="w-full bg-gradient-to-r from-secondary via-card to-secondary py-4">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <SteamingCoffeeCup />
          <div>
            <h3 className="font-headline text-xl sm:text-2xl font-bold text-primary">
              ☕ RM3 Morning Rush
            </h3>
            <p className="text-sm text-muted-foreground">Available till 11 AM daily</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          {timeLeft ? (
            <div className="flex items-center gap-2">
              <TimerDisplay time={timeLeft.hours} label="hours" />
              <span className="text-2xl font-bold text-primary">:</span>
              <TimerDisplay time={timeLeft.minutes} label="mins" />
              <span className="text-2xl font-bold text-primary">:</span>
              <TimerDisplay time={timeLeft.seconds} label="secs" />
            </div>
          ) : (
            <div className="text-center">
              <p className="font-bold text-primary text-base sm:text-lg">Morning Rush Over!</p>
              <p className="text-xs text-muted-foreground">See you tomorrow.</p>
            </div>
          )}

          <Button asChild size="lg" className="hidden lg:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105">
            <a href="/outlets">
              Grab Yours Today <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse-light {
          0%, 100% {
            box-shadow: 0 0 2px hsl(var(--ring) / 0.4), 0 0 5px hsl(var(--ring) / 0.2);
          }
          50% {
             box-shadow: 0 0 8px hsl(var(--ring) / 0.6), 0 0 12px hsl(var(--ring) / 0.4);
          }
        }
        .animate-pulse-light {
          animation: pulse-light 2.5s infinite;
        }
      `}</style>
    </div>
  );
};
