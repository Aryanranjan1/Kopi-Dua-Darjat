'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Instagram, MapPin } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function FooterCta() {
    return (
        <section className="py-16 bg-primary text-primary-foreground">
            <AnimateOnScroll animationType='fadeIn'>
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                        Find your nearest Kopi.
                    </h2>
                    <p className="mt-2 text-lg text-muted-foreground max-w-xl mx-auto">
                        Sip, snap, and share your moment with us.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="rounded-full bg-black text-white hover:bg-white hover:text-black">
                            <Link href="/outlets">
                                <MapPin className="mr-2 h-5 w-5" />
                                Locate Outlet
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="rounded-full border-foreground/50 text-foreground hover:bg-foreground hover:text-background">
                            <Link href="#">
                                <Instagram className="mr-2 h-5 w-5" />
                                Follow Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </AnimateOnScroll>
        </section>
    )
}
