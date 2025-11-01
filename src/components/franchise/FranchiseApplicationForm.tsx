
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  budget: z.string({ required_error: 'Please select your investment budget.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }).max(500),
});

export default function FranchiseApplicationForm() {
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            city: '',
            message: '',
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Here you would typically send the data to your backend (e.g., Firestore)
        console.log(values);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: "Application Submitted!",
            description: "Thank you for your interest. Our team will get in touch with you soon.",
            variant: "default",
        });
        form.reset();
  }

  const inputStyles = "bg-zinc-900 border-zinc-800 rounded-full text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ahmad bin Abdullah" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., ahmad@example.com" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 012-3456789" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred City/State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Kuala Lumpur" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Investment Budget</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className={inputStyles}>
                        <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="<25k">Below RM25,000</SelectItem>
                        <SelectItem value="25k-50k">RM25,000 - RM50,000</SelectItem>
                        <SelectItem value="50k-100k">RM50,000 - RM100,000</SelectItem>
                        <SelectItem value=">100k">Above RM100,000</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to join Kopi Dua Darjat?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about your passion for coffee and business..."
                  className="bg-zinc-900 border-zinc-800 text-white rounded-2xl resize-none focus-visible:ring-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6">
            {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                </>
            ) : (
                'Submit Application'
            )}
        </Button>
      </form>
    </Form>
  );
}
