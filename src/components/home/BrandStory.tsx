"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimateOnScroll } from "@/components/animations/AnimateOnScroll"
import { Leaf, Award, Coffee } from "lucide-react"
import { FeatureLine } from "./FeatureLine"

const features = [
  {
    icon: Award,
    title: "Authentic Kopi Kampung Recipe",
    description: "Honoring the rich legacy of traditional Malaysian coffee.",
  },
  {
    icon: Leaf,
    title: "Premium Artisan Beans",
    description: "Carefully selected and roasted to perfection for a superior taste.",
  },
  {
    icon: Coffee,
    title: "Brewed Fresh Daily",
    description: "Every cup is prepared with passion to ensure the highest quality.",
  },
]

export default function BrandStory() {
  return (
    <section className="py-24 sm:py-32 bg-[#F7F4EF] text-foreground">
      <div className="container mx-auto px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Image and Features */}
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
            
            {/* Feature Callouts */}
            <div className="absolute top-0 -left-16 w-48 text-right">
              <FeatureLine feature={features[0]} position="topLeft" />
            </div>
            <div className="absolute top-1/2 -left-24 w-48 text-right -translate-y-1/2">
              <FeatureLine feature={features[1]} position="left" />
            </div>
            <div className="absolute bottom-0 -left-16 w-48 text-right">
               <FeatureLine feature={features[2]} position="bottomLeft" />
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
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
