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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { DEFAULT_ROOM_ID } from "@/lib/constants";

const formSchema = z.object({
  ageGroup: z.string().min(1, "Please select your age group"),
  supportCategory: z.string().min(1, "Please select what kind of support you need"),
});

interface OnboardingFormProps {
  currentStep: number;
  setStep: (step: number) => void;
}

export function OnboardingForm({ currentStep, setStep }: OnboardingFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { setAuthenticated } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageGroup: "",
      supportCategory: "",
    },
  });

  const validateStep = async () => {
    if (currentStep === 1) {
      const ageGroup = form.getValues("ageGroup");
      if (!ageGroup) {
        form.setError("ageGroup", {
          type: "required",
          message: "Please select your age group",
        });
        return false;
      }
      return true;
    }
    
    if (currentStep === 2) {
      const supportCategory = form.getValues("supportCategory");
      if (!supportCategory) {
        form.setError("supportCategory", {
          type: "required",
          message: "Please select a support category",
        });
        return false;
      }
      return true;
    }
    
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 3) {
      const values = form.getValues();
      if (values.ageGroup && values.supportCategory) {
        setAuthenticated({
          ageGroup: values.ageGroup,
          supportCategory: values.supportCategory,
        });
        toast({
          title: "Welcome to WhisperSpace",
          description: "Connecting you with your support group...",
        });
        router.push(`/chat/${DEFAULT_ROOM_ID}`);
      }
      return;
    }

    const isValid = await validateStep();
    if (isValid) {
      setStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormField
            control={form.control}
            name="ageGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age Group</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
        );
      case 2:
        return (
          <FormField
            control={form.control}
            name="supportCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review Your Preferences</h3>
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p>
                <span className="font-medium">Age Group:</span>{" "}
                {form.getValues("ageGroup")}
              </p>
              <p>
                <span className="font-medium">Support Category:</span>{" "}
                {form.getValues("supportCategory")}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        {renderStepContent()}
        <div className="flex justify-between">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(currentStep - 1)}
            >
              Previous
            </Button>
          )}
          <Button
            type="submit"
            className={currentStep === 1 ? "w-full" : "ml-auto"}
          >
            {currentStep === 3 ? "Join Support Group" : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}