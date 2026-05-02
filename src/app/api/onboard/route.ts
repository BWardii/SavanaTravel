import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { onboardingSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name, email, dob, destination, departure_date, return_date,
      num_travelers, special_requests, phone,
      nationality, passport_number, passport_expiry,
      travellers,
    } = parsed.data;

    // 1. Insert lead customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .insert({
        name, email, dob, destination,
        departure_date, return_date,
        num_travelers,
        special_requests: special_requests ?? null,
        phone,
        nationality,
        passport_number,
        passport_expiry,
        status: "Pending",
      })
      .select("id")
      .single();

    if (customerError || !customer) {
      console.error("[onboard] Customer insert error:", customerError);
      return NextResponse.json(
        { error: "Failed to save your request. Please try again." },
        { status: 500 }
      );
    }

    // 2. Insert additional travellers (if any)
    if (travellers && travellers.length > 0) {
      const { error: travellersError } = await supabaseAdmin
        .from("travellers")
        .insert(
          travellers.map((t) => ({
            customer_id: customer.id,
            name: t.name,
            dob: t.dob,
            nationality: t.nationality,
            passport_number: t.passport_number,
            passport_expiry: t.passport_expiry,
          }))
        );

      if (travellersError) {
        console.error("[onboard] Travellers insert error:", travellersError);
        // Don't block submission — customer record is already saved
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[onboard] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
