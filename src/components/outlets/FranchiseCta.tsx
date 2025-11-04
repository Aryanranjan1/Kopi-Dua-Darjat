
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function FranchiseCta() {
    return (
        <section className="py-24 sm:py-32 bg-background">
            <AnimateOnScroll animationType='fadeIn'>
                <div className="container mx-auto px-6">
                    <div className="bg-primary text-primary-foreground p-12 sm:p-20 rounded-3xl border-4 border-black text-center">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                            Love our coffee?
                        </h2>
                        <p className="mt-2 text-lg text-muted-foreground max-w-xl mx-auto">
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
                </div>
            </AnimateOnScroll>
        </section>
    )
}
