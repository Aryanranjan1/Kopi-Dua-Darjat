import Image from 'next/image';
import Stats from '@/components/home/Stats';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function StatsSection() {
    const statsImage = PlaceHolderImages.find((img) => img.id === 'stats-image');
  return (
    <section className="relative z-10 w-full bg-black text-background [clip-path:ellipse(150%_80%_at_50%_100%)] -mt-[15vh] md:-mt-[12vh]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-10 items-center pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="md:col-span-6">
            <Stats />
        </div>
        <div className="hidden md:block md:col-span-4 lg:col-span-3 lg:col-start-8">
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
      </div>
    </section>
  );
}
