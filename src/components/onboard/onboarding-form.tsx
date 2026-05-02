"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  onboardingSchema,
  tripDetailsSchema,
  personalInfoSchema,
  type OnboardingData,
} from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./step-indicator";
import { StepTripDetails } from "./step-trip-details";
import { StepPersonalInfo } from "./step-personal-info";
import { StepReview } from "./step-review";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const TOTAL_STEPS = 3;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export function OnboardingForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<OnboardingData, any, OnboardingData>({
    resolver: zodResolver(onboardingSchema) as any,
    defaultValues: {
      destination: "",
      departure_date: "",
      return_date: "",
      num_travelers: 1,
      special_requests: "",
      name: "",
      email: "",
      dob: "",
      phone: "",
      nationality: "",
      passport_number: "",
      passport_expiry: "",
      travellers: [],
    },
    mode: "onTouched",
  });

  const stepSchemas = [tripDetailsSchema, personalInfoSchema, onboardingSchema];

  async function validateStep(): Promise<boolean> {
    const fields = Object.keys(stepSchemas[step].shape) as Array<
      keyof OnboardingData
    >;
    const result = await form.trigger(fields);
    return result;
  }

  async function handleNext() {
    const isValid = await validateStep();
    if (!isValid) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data: OnboardingData) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submission failed");
      }

      toast.success("Request submitted!", {
        description:
          "We'll be in touch within 24 hours with your personalised quote.",
      });
      router.push("/onboard/success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error("Submission failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const steps = [<StepTripDetails />, <StepPersonalInfo />, <StepReview />];

  return (
    <FormProvider {...form}>
      <div className="space-y-8">
        <StepIndicator currentStep={step} />

        <div className="relative overflow-hidden min-h-[440px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[#E8E2D9] mt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="text-sm text-[#9C8B7E] hover:text-[#1C1917] transition-colors disabled:opacity-0 tracking-wide"
          >
            {t.back}
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-px transition-all duration-300 ${
                  i === step
                    ? "w-8 bg-[#1C1917]"
                    : i < step
                    ? "w-4 bg-[#8B7355]"
                    : "w-4 bg-[#D4CAC0]"
                }`}
              />
            ))}
          </div>

          {step < TOTAL_STEPS - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-[#1C1917] hover:bg-[#2D2520] text-white rounded-none h-9 px-6 text-sm tracking-wide"
            >
              {t.continue}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="bg-[#1C1917] hover:bg-[#2D2520] text-white rounded-none h-9 px-6 text-sm tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.submitEnquiry
              )}
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
