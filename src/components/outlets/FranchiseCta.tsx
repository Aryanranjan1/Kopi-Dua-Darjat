
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function FranchiseCta() {
    const bgImage = PlaceHolderImages.find((img) => img.id === 'franchise-cta');

    return (
        <section className="relative py-24 sm:py-32 text-white">
             {bgImage && (
                <div className="absolute inset-0 z-[-2]">
                    <Image
                        src={bgImage.imageUrl}
                        alt={bgImage.description}
                        fill
                        className="object-cover hue-rotate-30"
                        data-ai-hint={bgImage.imageHint}
                    />
                </div>
            )}
            <div className="absolute inset-0 bg-black/60 z-[-1]"></div>
            
            <AnimateOnScroll animationType='fadeIn'>
                <div className="container mx-auto px-6 text-center relative z-10">
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
        </section>
    )
}
