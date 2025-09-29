import Stats from '@/components/home/Stats';

export default function StatsSection() {
  return (
    <section className="relative z-10 w-full text-background bg-black -mt-[15vh] md:-mt-[12vh]">
        <div className="container mx-auto pt-16 pb-8 md:pt-24 md:pb-12">
            <Stats />
        </div>
    </section>
  );
}
