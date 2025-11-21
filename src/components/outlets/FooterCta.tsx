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

    const imageUrl = bgImage?.imageUrl || "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8Y29mZmVlfGVufDB8fHx8fDE3NjIwMDE0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080";
    const imageAlt = bgImage?.description || "A cup of coffee on a wooden table, representing Kopi Dua Darjat";
    const imageHint = bgImage?.imageHint || "cup of coffee";

    return (
        <section className="relative py-24 sm:py-32 bg-black text-white">
            {isLoading ? <Skeleton className="absolute inset-0" /> : (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        data-ai-hint={imageHint}
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
