import Image from 'next/image';
import Stats from '@/components/home/Stats';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function StatsSection() {
    const statsImage = PlaceHolderImages.find((img) => img.id === 'stats-image');
  return (
    <section className="relative z-10 w-full bg-black text-background [clip-path:ellipse(150%_80%_at_50%_100%)] -mt-[15vh] md:-mt-[12vh]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="md:col-span-1">
            <Stats />
        </div>
      </div>
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0 w-1/4 lg:w-1/5">
        {statsImage && (
            <div className="aspect-square relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                    src={statsImage.imageUrl}
                    alt={statsImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={statsImage.imageHint}
                />
            </div>
        )}
      </div>
    </section>
  );
}
