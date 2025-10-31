"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { AnimateOnScroll } from "@/components/animations/AnimateOnScroll"

export default function BrandStory() {
  const bgImage = PlaceHolderImages.find((img) => img.id === 'new-section-image');

  return (
    <section className="relative py-32 sm:py-48 text-white">
      <div className="absolute inset-0 z-[-2]">
        {bgImage && (
            <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                fill
                className="object-cover"
                data-ai-hint={bgImage.imageHint}
            />
        )}
      </div>
      <div className="absolute inset-0 bg-black/60 z-[-1]"></div>

      <div className="container mx-auto px-12 relative z-10">
        <div className="max-w-3xl text-center mx-auto">
            <AnimateOnScroll animationType="slideInFromBottom">
                <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary leading-tight">
                    Antara Warisan & Artisan
                </h2>
                <p className="mt-6 text-lg text-white/90">
                    Kopi Dua Darjat was born from a simple vision: to honour the rich legacy of Malaysian Kopi Kampung while embracing the meticulous craft of artisan coffee. We bridge generations, serving nostalgic flavours with a modern touch, ensuring every cup is a testament to our dual heritage.
                </p>
            </AnimateOnScroll>
            <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-8">
                <Button size="lg" asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    <Link href="/about">
                    Discover Our Story
                    </Link>
                </Button>
            </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
