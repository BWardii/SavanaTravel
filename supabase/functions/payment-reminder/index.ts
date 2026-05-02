import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

Deno.serve(async (_req) => {
  try {
    const today = new Date();
    const reminderDate = new Date(today);
    reminderDate.setDate(today.getDate() + 3);

    const targetDate = reminderDate.toISOString().split("T")[0];

    // Find all pending customers with payment due in exactly 3 days
    const { data: customers, error } = await supabase
      .from("customers")
      .select("id, name, email, destination, flight_price, payment_due_date")
      .eq("status", "Pending")
      .eq("payment_due_date", targetDate);

    if (error) {
      console.error("Supabase query error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!customers || customers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No reminders to send today", sent: 0 }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const results = await Promise.allSettled(
      customers.map(async (customer) => {
        const formattedDue = new Date(
          customer.payment_due_date
        ).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const formattedPrice =
          customer.flight_price !== null
            ? new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(customer.flight_price)
            : "TBC";

        const { error: emailError } = await resend.emails.send({
          from: "Savana Travel <reminders@savanatravel.com>",
          to: customer.email,
          subject: `Payment Reminder — Your flight to ${customer.destination}`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:32px 40px;">
              <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Savana Travel</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:300;letter-spacing:-0.5px;">
                Payment Reminder
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
                Dear <strong style="color:#1e293b;">${customer.name}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                This is a friendly reminder that your payment for the following booking is due in <strong style="color:#4f46e5;">3 days</strong>.
              </p>
              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;border-bottom:1px solid #e2e8f0;">
                          <span style="color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Destination</span>
                        </td>
                        <td style="padding:6px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                          <span style="color:#1e293b;font-size:14px;font-weight:600;">${customer.destination}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;border-bottom:1px solid #e2e8f0;">
                          <span style="color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Flight Price</span>
                        </td>
                        <td style="padding:6px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                          <span style="color:#1e293b;font-size:14px;font-weight:600;">${formattedPrice}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Payment Due</span>
                        </td>
                        <td style="padding:6px 0;text-align:right;">
                          <span style="color:#dc2626;font-size:14px;font-weight:700;">${formattedDue}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
                To avoid losing your reservation, please ensure payment is made before the due date. 
                If you have any questions, reply to this email or contact your travel consultant directly.
              </p>
              <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
                Warm regards,<br>
                <strong style="color:#475569;">The Savana Travel Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} Savana Travel Ltd · You're receiving this because you have a pending booking.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `.trim(),
        });

        if (emailError) throw new Error(emailError.message);
        return customer.email;
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`Payment reminders: ${sent} sent, ${failed} failed`);

    return new Response(
      JSON.stringify({ message: "Reminders processed", sent, failed }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
