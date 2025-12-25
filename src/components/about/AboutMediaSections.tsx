
'use client';

import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import TiltedCard from '@/components/animations/TiltedCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useMedia } from '@/lib/media';
import { Check } from 'lucide-react';
import { useLanguage } from '../layout/LanguageProvider';

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

const MilestoneSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
      <Skeleton className="h-24" />
      <Skeleton className="aspect-[4/3] rounded-2xl" />
    </div>
)

const FounderSkeleton = () => (
     <div className="grid md:grid-cols-3 gap-12 items-center">
        <Skeleton className="aspect-square md:aspect-[3/4] rounded-2xl" />
        <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-6 w-1/4" />
        </div>
    </div>
)

export default function AboutMediaSections({ content }: { content: any }) {
  const { data: media, isLoading: isLoadingMedia } = useMedia();

  if (!content) return null;
  const aboutContent = content.about;
  if (!aboutContent) return null;

  return (
    <>
      {/* Milestones Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-6">
          <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground inline-block underline decoration-primary decoration-4 underline-offset-8">{aboutContent.milestones.title}</h2>
          </AnimateOnScroll>
          <div className="max-w-5xl mx-auto relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-border hidden md:block"></div>
              
              <div className="space-y-24">
                {isLoadingMedia ? (
                    [...Array(5)].map((_, i) => <MilestoneSkeleton key={i} />)
                ) : aboutContent.milestones.items.map((milestone: any, index: number) => {
                  const image = media?.find(m => m.id === milestone.imageId);
                  return image ? (
                    <div key={index} className="relative">
                        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent ring-8 ring-background"></div>
                        <Milestone
                            year={milestone.year}
                            title={milestone.title}
                            description={milestone.description}
                            imageUrl={image.imageUrl}
                            imageHint={image.imageHint}
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
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white inline-block underline decoration-primary decoration-4 underline-offset-8">{aboutContent.founders.title}</h2>
          </AnimateOnScroll>
          <div className="max-w-5xl mx-auto space-y-24">
             {isLoadingMedia ? (
                <>
                    <FounderSkeleton />
                    <FounderSkeleton />
                </>
            ) : (
                <>
                <AnimateOnScroll animationType="slideInFromLeft">
                {(() => {
                    const founder = aboutContent.founders.items[0];
                    const image = media?.find(m => m.id === founder.imageId);
                    return (founder && image) ? (
                        <FounderMessage 
                            name={founder.name}
                            quote={founder.quote}
                            imageUrl={image.imageUrl}
                            imageHint={image.imageHint}
                        />
                    ) : null;
                })()}
                </AnimateOnScroll>
                <AnimateOnScroll animationType="slideInFromRight">
                {(() => {
                    const founder = aboutContent.founders.items[1];
                    const image = media?.find(m => m.id === founder.imageId);
                    return (founder && image) ? (
                        <FounderMessage 
                            name={founder.name}
                            quote={founder.quote}
                            imageUrl={image.imageUrl}
                            imageHint={image.imageHint}
                            reverse
                        />
                    ) : null;
                })()}
                </AnimateOnScroll>
                </>
            )}
          </div>
        </div>
      </section>
       {/* Vision & Mission Section */}
      <AnimateOnScroll animationType="fadeIn">
        <section className="bg-background text-foreground">
          <div className="container mx-auto px-0">
              <div className="grid lg:grid-cols-2">
                  <div className="bg-primary text-primary-foreground p-12 lg:p-24 flex flex-col justify-center text-center lg:text-left">
                      <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">{aboutContent.visionMission.visionTitle}</h2>
                      <p className="mt-4 text-xl md:text-2xl font-serif text-foreground/80 max-w-md mx-auto lg:mx-0">
                          {aboutContent.visionMission.visionText}
                      </p>
                  </div>
                  <div className="bg-background text-foreground p-12 lg:p-24">
                      <h3 className="text-3xl font-headline font-bold text-accent mb-6">{aboutContent.visionMission.missionTitle}</h3>
                      <ul className="space-y-4">
                          {aboutContent.visionMission.missionItems.map((item: string, index: number) => (
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
    </>
  )
}
