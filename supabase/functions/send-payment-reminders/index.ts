// Supabase Edge Function — send-payment-reminders
// Deno runtime — runs every morning at 09:00 UTC via pg_cron + pg_net
// deno-lint-ignore-file no-explicit-any

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@3";

// ─── Config ────────────────────────────────────────────────────────────────────

/** Email address that receives manager copy of every reminder */
const MANAGER_EMAIL = Deno.env.get("MANAGER_EMAIL") ?? "manager@savanatravel.com";

/** Verified sender address in your Resend domain */
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "reminders@savanatravel.com";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  destination: string;
  flight_price: number | null;
  payment_due_date: string;
}

interface SendResult {
  customerId: string;
  customerName: string;
  success: boolean;
  error?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount: number | null): string {
  if (amount == null) return "TBC";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Returns the date exactly `days` from now as a YYYY-MM-DD string (UTC). */
function dateInDays(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

// ─── Email templates ───────────────────────────────────────────────────────────

function buildCustomerEmail(c: CustomerRow): { subject: string; html: string } {
  return {
    subject: `Payment reminder — ${c.destination} trip (due ${formatDate(c.payment_due_date)})`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #E8E2D9;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="padding:32px 40px;border-bottom:1px solid #E8E2D9;">
            <p style="margin:0;font-size:22px;font-weight:300;letter-spacing:0.05em;color:#1C1917;">
              Savana Travel
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;font-size:15px;color:#1C1917;line-height:1.6;">
              Dear <strong>${c.name}</strong>,
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#6B5E52;line-height:1.6;">
              This is a friendly reminder that your travel payment for
              <strong>${c.destination}</strong> is due in <strong>3 days</strong>.
            </p>

            <!-- Detail box -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#FAF8F4;border-left:3px solid #8B7355;margin:0 0 28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9C8B7E;">
                    Payment Details
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#9C8B7E;padding:4px 0;">Destination</td>
                      <td align="right" style="font-size:13px;font-weight:600;color:#1C1917;">${c.destination}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#9C8B7E;padding:4px 0;">Amount Due</td>
                      <td align="right" style="font-size:16px;font-weight:700;color:#1C1917;">${formatCurrency(c.flight_price)}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#9C8B7E;padding:4px 0;">Due Date</td>
                      <td align="right" style="font-size:13px;font-weight:600;color:#1C1917;">${formatDate(c.payment_due_date)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 12px;font-size:14px;color:#6B5E52;line-height:1.6;">
              Please contact your consultant if you have any questions about your
              booking or need to discuss payment arrangements.
            </p>
            <p style="margin:0;font-size:14px;color:#6B5E52;line-height:1.6;">
              Thank you for choosing Savana Travel.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #E8E2D9;">
            <p style="margin:0;font-size:11px;color:#9C8B7E;">
              This is an automated reminder from Savana Travel. Please do not reply to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

function buildManagerEmail(customers: CustomerRow[]): { subject: string; html: string } {
  const rows = customers
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 12px;font-size:13px;color:#1C1917;border-bottom:1px solid #E8E2D9;">${c.name}</td>
        <td style="padding:10px 12px;font-size:13px;color:#6B5E52;border-bottom:1px solid #E8E2D9;">${c.email}</td>
        <td style="padding:10px 12px;font-size:13px;color:#6B5E52;border-bottom:1px solid #E8E2D9;">${c.destination}</td>
        <td align="right" style="padding:10px 12px;font-size:13px;font-weight:600;color:#1C1917;border-bottom:1px solid #E8E2D9;">${formatCurrency(c.flight_price)}</td>
        <td style="padding:10px 12px;font-size:13px;color:#6B5E52;border-bottom:1px solid #E8E2D9;">${formatDate(c.payment_due_date)}</td>
      </tr>`
    )
    .join("");

  return {
    subject: `[Savana] ${customers.length} payment${customers.length > 1 ? "s" : ""} due in 3 days`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #E8E2D9;max-width:700px;width:100%;">

        <tr>
          <td style="padding:32px 40px;border-bottom:1px solid #E8E2D9;background:#1C1917;">
            <p style="margin:0;font-size:18px;font-weight:300;letter-spacing:0.05em;color:#FAF8F4;">
              Savana Travel — Payment Reminders
            </p>
            <p style="margin:6px 0 0;font-size:12px;color:#9C8B7E;">
              ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;font-size:15px;color:#1C1917;">
              The following ${customers.length} customer${customers.length > 1 ? "s have" : " has"} a payment due in
              <strong>3 days</strong>. Reminders have been sent to each customer.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8E2D9;">
              <thead>
                <tr style="background:#F5F0E8;">
                  <th align="left" style="padding:10px 12px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9C8B7E;">Name</th>
                  <th align="left" style="padding:10px 12px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9C8B7E;">Email</th>
                  <th align="left" style="padding:10px 12px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9C8B7E;">Destination</th>
                  <th align="right" style="padding:10px 12px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9C8B7E;">Amount</th>
                  <th align="left" style="padding:10px 12px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9C8B7E;">Due Date</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 40px;border-top:1px solid #E8E2D9;">
            <p style="margin:0;font-size:11px;color:#9C8B7E;">
              Automated daily reminder — Savana Travel Management System
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

// ─── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (_req: Request): Promise<Response> => {
  try {
    // ── 1. Init clients ──────────────────────────────────────────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

    const targetDate = dateInDays(3);
    console.log(`[send-payment-reminders] Checking for due dates on: ${targetDate}`);

    // ── 2. Fetch customers due in exactly 3 days ─────────────────────────────
    const { data: customers, error: fetchError } = await supabase
      .from("customers")
      .select("id, name, email, destination, flight_price, payment_due_date")
      .eq("payment_due_date", targetDate)
      .neq("status", "Paid")
      .returns<CustomerRow[]>();

    if (fetchError) {
      console.error("[send-payment-reminders] DB fetch error:", fetchError.message);
      return Response.json({ error: fetchError.message }, { status: 500 });
    }

    if (!customers || customers.length === 0) {
      console.log("[send-payment-reminders] No customers due in 3 days — nothing to send.");
      return Response.json({ sent: 0, message: "No reminders needed today." });
    }

    console.log(`[send-payment-reminders] Found ${customers.length} customer(s) to notify.`);

    // ── 3. Send individual customer emails ───────────────────────────────────
    const results: SendResult[] = [];

    for (const customer of customers) {
      const { subject, html } = buildCustomerEmail(customer);

      const { error: sendError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: customer.email,
        subject,
        html,
      });

      if (sendError) {
        console.error(
          `[send-payment-reminders] Failed to email customer ${customer.id} (${customer.email}):`,
          sendError
        );
        results.push({ customerId: customer.id, customerName: customer.name, success: false, error: String(sendError) });
        continue;
      }

      // ── 4. Update last_notified_at after successful send ───────────────────
      const { error: updateError } = await supabase
        .from("customers")
        .update({ last_notified_at: new Date().toISOString() })
        .eq("id", customer.id);

      if (updateError) {
        console.warn(
          `[send-payment-reminders] Could not update last_notified_at for ${customer.id}:`,
          updateError.message
        );
      }

      results.push({ customerId: customer.id, customerName: customer.name, success: true });
      console.log(`[send-payment-reminders] ✓ Reminder sent to ${customer.name} (${customer.email})`);
    }

    // ── 5. Send manager summary email ────────────────────────────────────────
    const { subject: managerSubject, html: managerHtml } = buildManagerEmail(customers);

    const { error: managerSendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: MANAGER_EMAIL,
      subject: managerSubject,
      html: managerHtml,
    });

    if (managerSendError) {
      console.error("[send-payment-reminders] Failed to send manager summary:", managerSendError);
    } else {
      console.log(`[send-payment-reminders] ✓ Manager summary sent to ${MANAGER_EMAIL}`);
    }

    // ── 6. Return summary ────────────────────────────────────────────────────
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return Response.json({
      sent: successCount,
      failed: failCount,
      targetDate,
      results,
    });

  } catch (err: any) {
    console.error("[send-payment-reminders] Unexpected error:", err);
    return Response.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
});
