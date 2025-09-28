import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BrandStoryGeneratorForm from './BrandStoryGeneratorForm';

export const metadata: Metadata = {
  title: 'Brand Story Generator',
  description: 'Generate compelling brand stories for Kopi Dua Darjat.',
};

export default function BrandStoryGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">
              Brand Story Generator
            </CardTitle>
            <CardDescription>
              Craft the perfect narrative for Kopi Dua Darjat for any publication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BrandStoryGeneratorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
