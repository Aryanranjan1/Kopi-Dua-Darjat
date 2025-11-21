
'use client';

import LatestStories from '@/components/home/LatestStories';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import WhoAreWe from '@/components/about/WhoAreWe';
import Stats from '@/components/about/Stats';
import { Check } from 'lucide-react';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import TiltedCard from '@/components/animations/TiltedCard';
import { Skeleton } from '@/components/ui/skeleton';
import StickyGallery from '@/components/about/StickyGallery';
import { siteContentData } from '@/lib/site-content';
import { siteContentDataMs } from '@/lib/site-content-ms';
import { useLanguage } from '@/components/layout/LanguageProvider';

const Milestone = ({
  year,
  title,
  description,
  imageUrl,
  imageHint,
  reverse = false,
}: {
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  reverse?: boolean;
}) => (
    <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
      <AnimateOnScroll animationType={reverse ? 'slideInFromLeft' : 'slideInFromRight'} className={`md:text-right ${reverse ? 'md:order-2' : ''}`}>
        <p className="text-sm font-semibold text-accent">{year}</p>
        <h3 className="mt-2 text-3xl font-headline font-bold text-foreground">{title}</h3>
        <p className="mt-4 text-muted-foreground">{description}</p>
      </AnimateOnScroll>
      <AnimateOnScroll animationType={reverse ? 'slideInFromRight' : 'slideInFromLeft'} className={`relative aspect-[4/3] rounded-2xl overflow-hidden group ${reverse ? 'md:order-1' : ''}`}>
        <TiltedCard 
          imageSrc={imageUrl}
          altText={title}
          containerHeight="100%"
          imageWidth="100%"
          imageHeight="100%"
          captionText={title}
        />
      </AnimateOnScroll>
    </div>
);

const FounderMessage = ({ name, quote, imageUrl, imageHint, reverse = false }: { name: string; quote: string; imageUrl: string; imageHint: string; reverse?: boolean }) => (
    <div className={`grid md:grid-cols-3 gap-12 items-center ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
        <div className={`relative aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden group ${reverse ? 'md:col-start-3' : ''}`}>
            <TiltedCard 
              imageSrc={imageUrl}
              altText={name}
              containerHeight="100%"
              imageWidth="100%"
              imageHeight="100%"
              captionText={name}
            />
        </div>
        <div className="md:col-span-2">
            <p className="text-2xl md:text-3xl leading-snug font-serif text-white">
                “{quote}”
            </p>
            <p className="mt-6 font-bold text-lg font-headline text-accent">- {name}</p>
        </div>
    </div>
);

// Temporary data until media is seeded
const tempImageData: { [key: string]: { url: string; hint: string } } = {
    'milestone-beginnings': { url: 'https://images.unsplash.com/photo-1601288338087-61203c693fac?w=500', hint: 'cafe storefront' },
    'milestone-recipes': { url: 'https://images.unsplash.com/photo-1583337757-5503b41460a5?w=500', hint: 'pastries' },
    'milestone-innovation': { url: 'https://images.unsplash.com/photo-1627902520211-73c980850fe8?w=500', hint: 'coffee brewing' },
    'milestone-community': { url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500', hint: 'community event' },
    'milestone-future': { url: 'https://images.unsplash.com/photo-1509395239591-59a68c07889b?w=500', hint: 'coffee bean' },
    'founder-hadi': { url: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=500', hint: 'portrait man' },
    'founder-azad': { url: 'https://images.unsplash.com/photo-1533901567451-7a6e68d6cd8f?w=500', hint: 'founder' },
};


export default function AboutPage() {
  const { language } = useLanguage();
  const content = language === 'ms' ? siteContentDataMs.about : siteContentData.about;

  return (
    <>
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <AnimateOnScroll animationType="fadeIn">
        <section className="py-24 sm:py-32 text-center bg-primary">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground">
              {content.hero.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/80">
              {content.hero.subtitle}
            </p>
          </div>
        </section>
      </AnimateOnScroll>

      <WhoAreWe />
      <Stats />

      {/* Milestones Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-6">
          <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground inline-block underline decoration-primary decoration-4 underline-offset-8">{content.milestones.title}</h2>
          </AnimateOnScroll>
          <div className="max-w-5xl mx-auto relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-border hidden md:block"></div>
              
              <div className="space-y-24">
                {content.milestones.items.map((milestone, index) => {
                  const image = tempImageData[milestone.imageId];
                  return image ? (
                    <div key={index} className="relative">
                        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent ring-8 ring-background"></div>
                        <Milestone
                            year={milestone.year}
                            title={milestone.title}
                            description={milestone.description}
                            imageUrl={image.url}
                            imageHint={image.hint}
                            reverse={index % 2 !== 0}
                        />
                    </div>
                  ) : null
                })}
              </div>
          </div>
        </div>
      </section>
      
      {/* Founder's Message Section */}
      <section className="py-24 sm:py-32 bg-black text-white">
        <div className="container mx-auto px-6">
          <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white inline-block underline decoration-primary decoration-4 underline-offset-8">{content.founders.title}</h2>
          </AnimateOnScroll>
          <div className="max-w-5xl mx-auto space-y-24">
                <AnimateOnScroll animationType="slideInFromLeft">
                {(() => {
                    const founder = content.founders.items[0];
                    const image = tempImageData[founder?.imageId];
                    return (founder && image) ? (
                        <FounderMessage 
                            name={founder.name}
                            quote={founder.quote}
                            imageUrl={image.url}
                            imageHint={image.hint}
                        />
                    ) : null;
                })()}
                </AnimateOnScroll>
                <AnimateOnScroll animationType="slideInFromRight">
                {(() => {
                    const founder = content.founders.items[1];
                    const image = tempImageData[founder?.imageId];
                    return (founder && image) ? (
                        <FounderMessage 
                            name={founder.name}
                            quote={founder.quote}
                            imageUrl={image.url}
                            imageHint={image.hint}
                            reverse
                        />
                    ) : null;
                })()}
                </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <AnimateOnScroll animationType="fadeIn">
        <section className="bg-background text-foreground">
          <div className="container mx-auto px-0">
              <div className="grid lg:grid-cols-2">
                  <div className="bg-primary text-primary-foreground p-12 lg:p-24 flex flex-col justify-center text-center lg:text-left">
                      <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">{content.visionMission.visionTitle}</h2>
                      <p className="mt-4 text-xl md:text-2xl font-serif text-foreground/80 max-w-md mx-auto lg:mx-0">
                          {content.visionMission.visionText}
                      </p>
                  </div>
                  <div className="bg-background text-foreground p-12 lg:p-24">
                      <h3 className="text-3xl font-headline font-bold text-accent mb-6">{content.visionMission.missionTitle}</h3>
                      <ul className="space-y-4">
                          {content.visionMission.missionItems.map((item, index) => (
                            <li key={index} className="flex items-start">
                                <Check className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
        </section>
      </AnimateOnScroll>
      
      <StickyGallery />
    </div>
    <LatestStories />
    <NewsletterSignUp />
    </>
  );
}
