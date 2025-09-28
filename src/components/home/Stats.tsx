import { Building2, BadgeDollarSign, TrendingUp, Sparkles } from 'lucide-react';

const stats = [
  {
    icon: Building2,
    value: '50+',
    label: 'Outlets Nationwide',
    description: 'Growing fast, loved by many.',
  },
  {
    icon: BadgeDollarSign,
    value: 'RM3-6',
    label: 'Affordable Indulgence',
    description: 'Premium taste, everyday price.',
  },
  {
    icon: TrendingUp,
    value: 'Fast',
    label: 'Return on Investment',
    description: 'A proven model for our partners.',
  },
  {
    icon: Sparkles,
    value: 'Halal',
    label: 'Certified Quality',
    description: 'Peace of mind in every sip.',
  },
];

export default function Stats() {
  return (
    <section className="bg-secondary py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <stat.icon className="w-10 h-10 text-accent" />
              <p className="mt-2 text-3xl font-bold text-primary">{stat.value}</p>
              <h3 className="text-lg font-semibold text-foreground">{stat.label}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
