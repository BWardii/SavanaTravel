import { z } from "zod";

// ─── Shared ────────────────────────────────────────────────────────────────────

export const travellerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(2, "Nationality is required"),
  passport_number: z
    .string()
    .min(5, "Passport number is required")
    .max(20, "Invalid passport number"),
  passport_expiry: z.string().min(1, "Passport expiry is required"),
});

// ─── Step 1 — Trip Details ─────────────────────────────────────────────────────

export const tripDetailsSchema = z.object({
  destination: z.string().min(2, "Please enter a destination"),
  departure_date: z.string().min(1, "Departure date is required"),
  return_date: z.string().min(1, "Return date is required"),
  num_travelers: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, "At least 1 traveler").max(20, "Maximum 20 travelers")
  ),
  special_requests: z.string().optional(),
});

// ─── Step 2 — Lead Passenger ───────────────────────────────────────────────────

export const personalInfoSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  dob: z.string().min(1, "Date of birth is required"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .regex(/^[\d\s\+\-\(\)]+$/, "Invalid phone number format"),
  nationality: z.string().min(2, "Nationality is required"),
  passport_number: z
    .string()
    .min(5, "Passport number is required")
    .max(20, "Invalid passport number"),
  passport_expiry: z.string().min(1, "Passport expiry date is required"),
  // Additional travellers (num_travelers - 1 entries)
  travellers: z.array(travellerSchema).optional().default([]),
});

// ─── Full form ─────────────────────────────────────────────────────────────────

export const onboardingSchema = tripDetailsSchema.merge(personalInfoSchema);

export type TravellerData    = z.infer<typeof travellerSchema>;
export type TripDetailsData  = z.infer<typeof tripDetailsSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type OnboardingData   = z.infer<typeof onboardingSchema>;
