
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email({ message: 'Please enter a valid email.' });

export default function MicrositeNewsletterSignUp() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    if (!firestore) {
      console.error('[Newsletter] Firestore unavailable');
      setError('Service unavailable. Try again later.');
      return;
    }
    setIsSubmitting(true);

    try {
      const subscribersRef = collection(firestore, 'newsletterSubscribers');
      await addDoc(subscribersRef, {
        email: email,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Subscribed!',
        description: "Thanks for joining our newsletter. You'll receive updates from us soon.",
      });
      setEmail('');
    } catch (err) {
      console.error('Error subscribing:', err);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not subscribe. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-primary text-black">
      <div className="container mx-auto px-6">
        <div className="border-4 border-dashed border-black p-8 sm:p-12 md:p-16 rounded-2xl">
            <div className="max-w-2xl text-center mx-auto">
            <AnimateOnScroll animationType="slideInFromBottom">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-black leading-tight">
                Get Brew-tiful News Straight to Your Inbox
                </h2>
                <p className="mt-4 text-lg text-black/80">
                Join our mailing list for exclusive deals, new drink announcements, and stories from the Kopi Dua Darjat community.
                </p>
            </AnimateOnScroll>

            <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-8">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-white/50 border-black/20 text-black placeholder:text-black/60 rounded-full text-center sm:text-left flex-grow"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" size="lg" className="bg-black hover:bg-black/90 text-white rounded-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Subscribe
                </Button>
                </form>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                <p className="text-xs text-black/60 mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </AnimateOnScroll>
            </div>
        </div>
      </div>
    </section>
  );
}

