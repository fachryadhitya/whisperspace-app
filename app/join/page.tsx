"use client";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { useState } from "react";

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center py-16">
      <div className="w-full max-w-2xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
              WhisperSpace
            </span>
          </h1>
          <p className="text-muted-foreground">
            Let's find the right support group for you
          </p>
        </div>
        <OnboardingProgress currentStep={step} totalSteps={totalSteps} />
        <OnboardingForm currentStep={step} setStep={setStep} />
      </div>
    </main>
  );
}