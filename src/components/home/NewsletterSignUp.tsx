"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMediaAsset } from "@/lib/media";
import { AnimateOnScroll } from "@/components/animations/AnimateOnScroll";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Skeleton } from "../ui/skeleton";

const emailSchema = z.string().email({ message: "Please enter a valid email." });

export default function NewsletterSignUp({ disableAnimations = false }: { disableAnimations?: boolean }) {
  // media hook
  const { asset: bgImage, isLoading: isLoadingImage } = useMediaAsset("newsletter-background");

  // local state for fallback switching
  const [useFallback, setUseFallback] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // firestore and UI
  const firestore = useFirestore();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // debug logging to help you see what's returned by useMediaAsset
  useEffect(() => {
    console.log("[Newsletter] bgImage:", bgImage);
    console.log("[Newsletter] isLoadingImage:", isLoadingImage);
  }, [bgImage, isLoadingImage]);

  // If bgImage is undefined after load, fallback to local immediately
  useEffect(() => {
    if (!isLoadingImage && !bgImage) {
      console.warn("[Newsletter] No bgImage found - using fallback.");
      setUseFallback(true);
    }
  }, [isLoadingImage, bgImage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    if (!firestore) {
      console.error("[Newsletter] Firestore unavailable");
      setError("Service unavailable. Try again later.");
      return;
    }
    setIsSubmitting(true);

    try {
      const subscribersRef = collection(firestore, "newsletterSubscribers");
      await addDoc(subscribersRef, {
        email: email,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Subscribed!",
        description:
          "Thanks for joining our newsletter. If you were already subscribed, you'll continue to receive our updates.",
      });
      setEmail("");
    } catch (err) {
      console.error("Error subscribing:", err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not subscribe. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Wrapper = disableAnimations ? "div" : AnimateOnScroll;
  const wrapperProps = disableAnimations ? {} : { animationType: "slideInFromBottom" as const };
  const formWrapperProps = disableAnimations ? {} : { animationType: "fadeIn" as const, delay: 0.2 };

  // Which image URL to render: bgImage.imageUrl if present otherwise local fallback
  const remoteUrl = bgImage?.imageUrl;
  const fallbackUrl = "/images/fallback-bg.jpg"; // ensure this file exists in public/

  // on image error -> fallback
  const handleImgError = (e?: any) => {
    console.warn("[Newsletter] Background image failed to load, switching to fallback.", e);
    setUseFallback(true);
  };

  return (
    <section className="relative py-24 sm:py-32 text-white">
      {/* Background layer */}
      <div className="absolute inset-0 z-[-20]">
        {isLoadingImage ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <>
            {/* Remote image attempt */}
            {!useFallback && remoteUrl ? (
              <Image
                src={remoteUrl}
                alt={bgImage?.description || "newsletter background"}
                fill
                className="object-cover"
                data-ai-hint={bgImage?.imageHint}
                onError={(e) => handleImgError(e)}
                onLoadingComplete={() => {
                  setImageLoaded(true);
                }}
                unoptimized
              />
            ) : (
              // local fallback
              <Image
                src={fallbackUrl}
                alt="newsletter fallback background"
                fill
                className="object-cover"
                onError={(e) => {
                  console.error("[Newsletter] fallback image failed to load", e);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* overlay */}
      <div className="absolute inset-0 bg-black/70 z-[-10]" />

      {/* content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl text-center mx-auto">
          <Wrapper {...wrapperProps}>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary leading-tight">
              Get Brew-tiful News Straight to Your Inbox
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Join our mailing list for exclusive deals, new drink announcements, and stories from the Kopi Dua Darjat community.
            </p>
          </Wrapper>

          <Wrapper {...formWrapperProps} className="mt-8">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-full text-center sm:text-left flex-grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Subscribe
              </Button>
            </form>

            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            <p className="text-xs text-white/50 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </Wrapper>
        </div>
      </div>
    </section>
  );
}
