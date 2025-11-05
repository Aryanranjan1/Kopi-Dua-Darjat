
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!firestore) {
      setError('An unexpected error occurred.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(firestore, 'newsletterSubscribers'), {
        email: email,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Subscribed!',
        description: "Thanks for joining. You're on the list!",
      });
      setEmail('');
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-20 md:py-32">
      <AnimateOnScroll className="container mx-auto px-6 max-w-2xl text-center">
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-black">
          Stay Brewed In.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Join our community and get exclusive updates & offers.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow rounded-md border-neutral-300 text-center sm:text-left focus-visible:ring-[#F9C349]"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-[#F9C349] text-black hover:bg-[#F9C349]/90"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Subscribe
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </AnimateOnScroll>
    </section>
  );
}
