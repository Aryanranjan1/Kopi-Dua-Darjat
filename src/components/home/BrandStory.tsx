"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimateOnScroll } from "@/components/animations/AnimateOnScroll"

export default function BrandStory() {
  return (
    <section className="pt-24 sm:pt-32 bg-[#F7F4EF] text-foreground overflow-hidden">
      <div className="mx-auto">
        <div className="grid lg:grid-cols-2 gap-x-8 gap-y-16 sm:gap-y-20 lg:gap-x-16 items-center">
          {/* Left Side: Image */}
          <div className="relative lg:pl-16">
              <AnimateOnScroll animationType="slideInFromLeft" className="relative flex justify-center items-center">
                <div className="relative w-[48rem] h-[48rem] lg:w-[60rem] lg:h-[60rem] lg:max-w-none -ml-32 lg:-ml-48">
                  <Image
                    src="/image/kdd-cup.png"
                    alt="Kopi Darjat"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </AnimateOnScroll>
          </div>

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
