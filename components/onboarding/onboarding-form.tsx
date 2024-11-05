"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  ageGroup: z.string({
    required_error: "Please select your age group.",
  }),
  supportCategory: z.string({
    required_error: "Please select what kind of support you're looking for.",
  }),
});

export function OnboardingForm() {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Welcome to WhisperSpace",
      description: "Connecting you with your support group...",
    });
    
    // Store values in session storage
    sessionStorage.setItem("userPreferences", JSON.stringify(values));
    
    // Redirect to chat
    router.push("/chat");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="ageGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your age group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45+">45+</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This helps us connect you with peers in a similar life stage.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supportCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select what kind of support you need" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="work-stress">Work Stress</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="anxiety">Anxiety</SelectItem>
                  <SelectItem value="depression">Depression</SelectItem>
                  <SelectItem value="life-changes">Life Changes</SelectItem>
                  <SelectItem value="general">General Support</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This helps us match you with people who understand your situation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Join Support Group</Button>
      </form>
    </Form>
  );
}