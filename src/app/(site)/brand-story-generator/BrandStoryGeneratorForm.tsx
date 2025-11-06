'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateBrandStoryAction, type BrandStoryState } from '@/app/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: BrandStoryState = {
  message: null,
  brandStory: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Generate Story
    </Button>
  );
}

export default function BrandStoryGeneratorForm() {
  const [state, formAction] = useFormState(generateBrandStoryAction, initialState);
  const [publicationType, setPublicationType] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === 'error') {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate the brand story. Please try again.',
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="publicationType" className="block text-sm font-medium text-gray-700">
            Publication Type
          </label>
          <Select
            name="publicationType"
            required
            onValueChange={setPublicationType}
            value={publicationType}
          >
            <SelectTrigger id="publicationType" className="w-full">
              <SelectValue placeholder="Select a publication type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="magazine">Magazine</SelectItem>
              <SelectItem value="blog">Blog Post</SelectItem>
              <SelectItem value="social-media">Social Media</SelectItem>
              <SelectItem value="press-release">Press Release</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.publicationType && (
            <p className="mt-2 text-sm text-red-600">{state.errors.publicationType[0]}</p>
          )}
        </div>
        <SubmitButton />
      </form>

      {state.brandStory && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Generated Brand Story:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{state.brandStory}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
