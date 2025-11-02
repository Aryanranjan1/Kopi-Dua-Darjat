
import type { Metadata } from 'next';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import LatestStories from '@/components/home/LatestStories';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import StickyScroll from '@/components/ui/sticky-scroll';
import WhoAreWe from '@/components/about/WhoAreWe';
import Stats from '@/components/about/Stats';
import { Check } from 'lucide-react';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about the history and passion behind Kopi Dua Darjat.',
};

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
  <AnimateOnScroll animationType={reverse ? 'slideInFromLeft' : 'slideInFromRight'}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative">
      {/* Dotted line */}
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-border -translate-x-1/2">
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent ring-4 ring-background"></div>
      </div>
      
      <div className={`md:text-right ${reverse ? 'md:order-2' : ''}`}>
        <p className="text-sm font-semibold text-accent">{year}</p>
        <h3 className="mt-2 text-3xl font-headline font-bold text-foreground">{title}</h3>
        <p className="mt-4 text-muted-foreground">{description}</p>
      </div>
      <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group ${reverse ? 'md:order-1' : ''}`}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-2deg]"
          data-ai-hint={imageHint}
        />
      </div>
    </div>
  </AnimateOnScroll>
);

const FounderMessage = ({ name, quote, imageUrl, imageHint, reverse = false }: { name: string; quote: string; imageUrl: string; imageHint: string; reverse?: boolean }) => (
    <div className={`grid md:grid-cols-3 gap-12 items-center ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
        <div className={`relative aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group ${reverse ? 'md:col-start-3' : ''}`}>
            <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                data-ai-hint={imageHint}
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

export default function AboutPage() {
  const founderHadi = PlaceHolderImages.find((img) => img.id === 'founder-hadi');
  const founderAzad = PlaceHolderImages.find((img) => img.id === 'founder-azad');
  
  const milestones = [
    {
      year: '2020',
      title: 'Humble Beginnings',
      description: 'Kopi Dua Darjat was born from a simple cart, with a big dream: to share authentic Malaysian kopi with everyone, affordably.',
      image: PlaceHolderImages.find((img) => img.id === 'milestone-beginnings'),
    },
    {
      year: '2021',
      title: 'Perfecting Recipes',
      description: 'Our obsession with quality led us to refine our recipes, balancing heritage flavors with artisan techniques to create our signature taste.',
      image: PlaceHolderImages.find((img) => img.id === 'milestone-recipes'),
    },
    {
      year: '2022',
      title: 'Culinary Innovation',
      description: 'We started innovating, introducing new series like Matcha and Menet, pushing the boundaries of what local coffee culture can be.',
      image: PlaceHolderImages.find((img) => img.id === 'milestone-innovation'),
    },
    {
      year: '2023',
      title: 'Community & Culture',
      description: 'More than just coffee, we became a community hub. Our stalls turned into meeting points for friends, family, and neighbors.',
      image: PlaceHolderImages.find((img) => img.id === 'milestone-community'),
    },
     {
      year: '2024',
      title: 'Future Forward',
      description: 'With over 50 outlets, we’re now looking ahead. Our focus is on sustainability, empowering local entrepreneurs, and continuing to innovate.',
      image: PlaceHolderImages.find((img) => img.id === 'milestone-future'),
    },
  ];

  return (
    <>
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <AnimateOnScroll animationType="fadeIn">
        <section className="py-24 sm:py-32 text-center bg-primary">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground">
              Our Journey, Our Passion
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/80">
              The story of a local brand that hopes to unite authenticity, heritage, and a love for the perfect cup of coffee.
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
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground inline-block underline decoration-primary decoration-4 underline-offset-8">Our Milestones</h2>
          </AnimateOnScroll>
          <div className="max-w-5xl mx-auto flex flex-col gap-24">
            {milestones.map((milestone, index) =>
              milestone?.image ? (
                <Milestone
                  key={index}
                  year={milestone.year}
                  title={milestone.title}
                  description={milestone.description}
                  imageUrl={milestone.image.imageUrl}
                  imageHint={milestone.image.imageHint}
                  reverse={index % 2 !== 0}
                />
              ) : null
            )}
          </div>
        </div>
      </section>
      
      {/* Founder's Message Section */}
      <section className="py-24 sm:py-32 bg-black text-white">
        <div className="container mx-auto px-6">
          <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white inline-block underline decoration-primary decoration-4 underline-offset-8">A Message from Our Founders</h2>
          </AnimateOnScroll>
          <div className="max-w-5xl mx-auto space-y-24">
            <AnimateOnScroll animationType="slideInFromLeft">
              {founderHadi && (
                  <FounderMessage 
                      name="Ahmad Hadi"
                      quote="Every cup tells a story, a blend of heritage and dreams. We started Kopi Dua Darjat to share the true essence of Malaysian coffee with the world, one cup at a time."
                      imageUrl={founderHadi.imageUrl}
                      imageHint={founderHadi.imageHint}
                  />
              )}
            </AnimateOnScroll>
            <AnimateOnScroll animationType="slideInFromRight">
              {founderAzad && (
                  <FounderMessage 
                      name="Azad"
                      quote="Our goal has always been to craft an authentic coffee experience that feels both nostalgic and new. We balance tradition with artistry, ensuring our methods are sustainable and our partners are empowered."
                      imageUrl={founderAzad.imageUrl}
                      imageHint={founderAzad.imageHint}
                      reverse
                  />
              )}
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
                      <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">Our Vision</h2>
                      <p className="mt-4 text-xl md:text-2xl font-serif text-foreground/80 max-w-md mx-auto lg:mx-0">
                          To become the most beloved and accessible artisan coffee brand in Southeast Asia.
                      </p>
                  </div>
                  <div className="bg-background text-foreground p-12 lg:p-24">
                      <h3 className="text-3xl font-headline font-bold text-accent mb-6">Our Mission</h3>
                      <ul className="space-y-4">
                          <li className="flex items-start">
                              <Check className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                              <span>To serve high-quality, ethically-sourced Malaysian coffee that champions local flavors.</span>
                          </li>
                          <li className="flex items-start">
                              <Check className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                              <span>To foster connection and culture in every community we serve, one cup at a time.</span>
                          </li>
                          <li className="flex items-start">
                              <Check className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                              <span>To preserve and promote the rich heritage of Malaysian coffee for future generations.</span>
                          </li>
                          <li className="flex items-start">
                              <Check className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                              <span>To innovate continuously with our products and experiences, empowering local entrepreneurs along the way.</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
        </section>
      </AnimateOnScroll>


      <StickyScroll />
    </div>
    <LatestStories />
    <NewsletterSignUp />
    </>
  );
}
