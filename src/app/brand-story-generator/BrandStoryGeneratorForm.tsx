'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateBrandStoryAction, type BrandStoryState } from '@/app/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Story
        </>
      )}
    </Button>
  );
}

export default function BrandStoryGeneratorForm() {
  const initialState: BrandStoryState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(generateBrandStoryAction, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="publicationType">Publication Type</Label>
        <Input
          id="publicationType"
          name="publicationType"
          placeholder="e.g., 'magazine', 'blog', 'social media'"
          required
        />
        {state.errors?.publicationType && (
          <p className="text-sm text-destructive">
            {state.errors.publicationType.join(', ')}
          </p>
        )}
      </div>

      <SubmitButton />

      {state.message === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem generating the brand story. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {state.brandStory && (
        <Card className="bg-secondary mt-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-accent" />
              Generated Brand Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{state.brandStory}</p>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
