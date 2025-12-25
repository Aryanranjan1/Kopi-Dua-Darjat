
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimateOnScroll } from "@/components/animations/AnimateOnScroll"
import { useLanguage } from "../layout/LanguageProvider"

export default function BrandStory({ content }: { content: any }) {
  const { language } = useLanguage();
  if (!content) return null;
  
  const localizedContent = content[language]?.home?.brandStory;
  if (!localizedContent) return null;

  const { title, content: storyContent, buttonText, buttonLink } = localizedContent;

  return (
    <section className="bg-[#F7F4EF] text-foreground overflow-hidden">
      <div className="container mx-auto px-6 lg:px-0">
        <div className="grid lg:grid-cols-2 gap-y-12 items-center">
          {/* Image Container */}
          <div className="relative h-auto min-h-[400px] lg:h-full lg:min-h-[600px] self-end order-2 lg:order-1">
              <AnimateOnScroll 
                animationType="slideInFromLeft"
                className="absolute -bottom-12 left-0 w-full h-full"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/image/kdd-cup.png"
                    alt="Kopi Darjat"
                    fill
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </AnimateOnScroll>
          </div>

          {/* Text Content */}
          <AnimateOnScroll animationType="slideInFromRight" className="py-12 lg:py-0 px-4 lg:px-8 text-center lg:text-left order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground leading-tight inline-block underline decoration-primary decoration-4 underline-offset-8">
              {title}
            </h2>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
              {storyContent}
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                <Link href={buttonLink}>
                  {buttonText}
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}

    