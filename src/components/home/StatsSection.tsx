import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Stats from '@/components/home/Stats';

export default function StatsSection() {
  return (
    <section className="relative z-20 w-full bg-black text-background [clip-path:ellipse(150%_80%_at_50%_100%)] -mt-[15vh] md:-mt-[12vh]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center pt-24 pb-8 md:pt-32 md:pb-12">
        <AnimateOnScroll animationType='fadeIn' amount={0.8} className="md:col-span-1">
            <Stats />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
