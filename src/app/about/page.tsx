
import type { Metadata } from 'next';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
    <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ${reverse ? 'md:order-1' : ''}`}>
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        data-ai-hint={imageHint}
      />
    </div>
  </div>
);

export default function AboutPage() {
  const founder = PlaceHolderImages.find((img) => img.id === 'founder-hadi');
  
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

  const galleryImages = [
    'gallery-1', 'gallery-2', 'gallery-3', 'gallery-4',
    'gallery-5', 'gallery-6', 'gallery-7', 'gallery-8'
  ].map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-24 sm:py-32 text-center bg-card">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary">
            Our Journey, Our Passion
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
            The story of a local brand that hopes to unite authenticity, heritage, and a love for the perfect cup of coffee.
          </p>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">Our Milestones</h2>
          </div>
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
      <section className="py-24 sm:py-32 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">A Message from Our Founder</h2>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 items-center">
            <div className="relative aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                {founder && (
                    <Image
                        src={founder.imageUrl}
                        alt="Kopi Dua Darjat Founder"
                        fill
                        className="object-cover object-center"
                        data-ai-hint={founder.imageHint}
                    />
                )}
            </div>
            <div className="md:col-span-2">
              <p className="text-2xl md:text-3xl leading-snug font-serif text-foreground">
                “Every cup tells a story, a blend of heritage and dreams. We started Kopi Dua Darjat to share the true essence of Malaysian coffee with the world, one cup at a time.
              </p>
              <p className="mt-6 text-lg text-muted-foreground">
                From our humble start to a national community, our goal has always been to craft an authentic coffee experience that feels both nostalgic and new. We balance tradition with artistry, ensuring our methods are sustainable and our partners are empowered. Thank you for being a part of our story.”
              </p>
              <p className="mt-6 font-bold text-lg font-headline text-accent">- Ahmad Hadi, Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">Our Vision & Mission</h2>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
                To be the leading purveyor of authentic Malaysian coffee culture, celebrated for our rich heritage, innovative spirit, and commitment to community.
            </p>
            <ul className="mt-8 space-y-4 text-left inline-block">
                {[
                    'To serve high-quality, ethically-sourced Malaysian coffee beans.',
                    'To create and provide friendly, inviting spaces that foster connection and culture appreciation.',
                    'To preserve and promote the rich heritage of Malaysian coffee culture.',
                    'To continuously innovate with products and experiences to expand our reach.'
                ].map((item, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-accent font-bold mr-3">✓</span>
                        <span className="text-muted-foreground">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
      </section>

      {/* Moments Gallery Section */}
      <section className="py-24 sm:py-32 bg-card">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">Moments from Our Journey</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                image && (
                  <div key={index} className={`relative aspect-square rounded-2xl overflow-hidden shadow-lg ${index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                )
              ))}
            </div>
         </div>
      </section>
    </div>
  );
}
