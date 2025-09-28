import { Building2, BadgeDollarSign, TrendingUp, Sparkles } from 'lucide-react';

const stats = [
  {
    icon: Building2,
    value: '50+ Outlets',
    label: 'Nationwide',
  },
  {
    icon: BadgeDollarSign,
    value: 'From RM3',
    label: 'Affordable Range',
  },
  {
    icon: TrendingUp,
    value: 'Proven ROI',
    label: 'for Franchisees',
  },
  {
    icon: Sparkles,
    value: 'Halal',
    label: 'Certified',
  },
];

export default function Stats() {
  return (
    <section className="bg-secondary py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <stat.icon className="w-10 h-10 text-accent" />
              <p className="mt-2 text-2xl font-bold font-headline text-primary">{stat.value}</p>
              <h3 className="text-md font-semibold text-foreground">{stat.label}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}