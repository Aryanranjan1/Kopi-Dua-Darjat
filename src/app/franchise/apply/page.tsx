import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FranchiseApplicationForm from '@/components/franchise/FranchiseApplicationForm';

export const metadata: Metadata = {
  title: 'Apply for Franchise',
  description: 'Start your journey to becoming a Kopi Dua Darjat franchisee.',
};

export default function FranchiseApplyPage() {
  return (
    <div className="bg-background min-h-screen py-24 sm:py-32">
        <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
                 <Button asChild variant="outline" className="mb-8 rounded-full">
                    <Link href="/franchise">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Franchise Page
                    </Link>
                </Button>
                <Card className="shadow-lg rounded-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl text-primary">
                    Franchise Application
                    </CardTitle>
                    <CardDescription className="text-lg">
                    Tell us a bit about yourself. We're excited to learn more about your interest in joining the Kopi Dua Darjat family.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FranchiseApplicationForm />
                </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
