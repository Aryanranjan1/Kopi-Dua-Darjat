'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { useMediaAsset } from '@/lib/media';
import { Skeleton } from '../ui/skeleton';

export default function FranchiseCta() {
    const { asset: bgImage, isLoading } = useMediaAsset('franchise-teaser');

    return (
        <section className="relative py-24 sm:py-32 bg-black text-white">
             {isLoading ? <Skeleton className="absolute inset-0" /> : bgImage && (
                <div className="absolute inset-0 z-0">
                <Image
                    src={bgImage.imageUrl}
                    alt={bgImage.description || "Franchise CTA background"}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    data-ai-hint={bgImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                </div>
            )}
            <div className="container mx-auto px-6 relative z-20">
                 <AnimateOnScroll animationType='fadeIn'>
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                            Love our coffee?
                        </h2>
                        <p className="mt-2 text-lg text-white/80 max-w-xl mx-auto">
                            Bring the taste of Kopi Dua Darjat to your town. Join our growing family of successful entrepreneurs.
                        </p>
                        <div className="mt-8">
                            <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/franchise">
                                    Become a Franchisee
                                </Link>
                            </Button>
                        </div>
                    </div>
                 </AnimateOnScroll>
            </div>
        </section>
    )
}
