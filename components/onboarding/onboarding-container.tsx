"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingForm } from "./onboarding-form";
import { OnboardingProgress } from "./onboarding-progress";

export function OnboardingContainer() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to WhisperSpace</CardTitle>
          <CardDescription className="text-center">
            A safe space for emotional support and connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <OnboardingProgress currentStep={step} totalSteps={totalSteps} />
          <OnboardingForm currentStep={step} setStep={setStep} />
        </CardContent>
      </Card>
    </div>
  );
}