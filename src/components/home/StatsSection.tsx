import Stats from '@/components/home/Stats';

export default function StatsSection() {
  return (
    <section className="relative z-10 w-full bg-primary text-primary-foreground -mt-[15vh] md:-mt-[12vh]">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
            <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[100px] fill-secondary"
            >
                <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                ></path>
            </svg>
        </div>
        <div className="container mx-auto pt-16 pb-8 md:pt-24 md:pb-12">
            <Stats />
        </div>
    </section>
  );
}
