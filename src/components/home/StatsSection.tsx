import Stats from '@/components/home/Stats';

export default function StatsSection() {
  return (
    <section className="relative z-10 w-full bg-black text-background [clip-path:ellipse(150%_80%_at_50%_100%)] -mt-[15vh] md:-mt-[12vh]">
      <div className="container mx-auto pt-24 pb-8 md:pt-32 md:pb-12">
        <Stats />
      </div>
    </section>
  );
}
