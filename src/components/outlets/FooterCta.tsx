
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Instagram, MapPin } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { useMediaAsset } from '@/lib/media';
import { Skeleton } from '../ui/skeleton';

export default function FooterCta() {
    const { asset: bgImage, isLoading } = useMediaAsset('cta-bg');

    return (
        <section className="relative py-24 sm:py-32 bg-black text-white">
            {isLoading ? <Skeleton className="absolute inset-0" /> : bgImage && (
                <div className="absolute inset-0 z-0">
                <Image
                    src={bgImage.imageUrl}
                    alt={bgImage.description || "Kopi Dua Darjat background"}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    data-ai-hint={bgImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                </div>
            )}
            <div className="container mx-auto px-6 text-center relative z-20">
                <AnimateOnScroll animationType='fadeIn'>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                        Find your nearest Kopi.
                    </h2>
                    <p className="mt-2 text-lg text-white/80 max-w-xl mx-auto">
                        Sip, snap, and share your moment with us.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <Link href="/outlets">
                                <MapPin className="mr-2 h-5 w-5" />
                                Locate Outlet
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="rounded-full border-white/80 bg-white/90 text-black hover:bg-white hover:text-black">
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <Instagram className="mr-2 h-5 w-5" />
                                Follow Us
                            </a>
                        </Button>
                    </div>
                </AnimateOnScroll>
            </div>
        </section>
    )
}
