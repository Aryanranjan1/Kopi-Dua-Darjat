"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimateOnScroll } from "@/components/animations/AnimateOnScroll"

export default function BrandStory() {
  return (
    <section className="py-24 sm:py-32 bg-[#F7F4EF] text-foreground">
      <div className="container mx-auto px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Image */}
          <AnimateOnScroll animationType="slideInFromLeft" className="relative flex justify-center items-center">
            <div className="relative w-72 h-72">
              <Image
                src="/image/a.png"
                alt="Kopi Darjat"
                width={400}
                height={400}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </AnimateOnScroll>

          {/* Right Side: Text Content */}
          <AnimateOnScroll animationType="slideInFromRight">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground leading-tight">
              Antara Warisan & Artisan
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Kopi Dua Darjat was born from a simple vision: to honour the rich legacy of Malaysian Kopi Kampung while embracing the meticulous craft of artisan coffee. We bridge generations, serving nostalgic flavours with a modern touch.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                <Link href="/about">
                  Discover Our Story
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
