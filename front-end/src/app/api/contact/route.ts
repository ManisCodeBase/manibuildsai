import { NextRequest, NextResponse } from "next/server";
import type { ContactFormData } from "@/types";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 2000);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactFormData;
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const cleanName = sanitize(name);
    const cleanMessage = sanitize(message);
    const cleanSubject = sanitize(subject);

    if (cleanName.length < 2 || cleanMessage.length < 10) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    // Send email via Resend if API key is configured
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL ?? "mani.ainml@gmail.com";

    if (resendKey) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Contact Form <noreply@manibuildsai.com>",
          to: [toEmail],
          reply_to: email,
          subject: `[manibuildsai.com] ${cleanSubject} — from ${cleanName}`,
          html: `
            <div style="font-family: monospace; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e5e5e5; padding: 32px; border-radius: 12px; border: 1px solid #1a1a2e;">
              <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #1a1a2e;">
                <h2 style="color: #00d4ff; margin: 0 0 4px 0; font-size: 18px;">New Contact Form Submission</h2>
                <p style="color: #444; margin: 0; font-size: 12px;">manibuildsai.com</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; color: #7c3aed; font-weight: bold; width: 90px;">From:</td><td style="padding: 8px 0;">${cleanName} &lt;${email}&gt;</td></tr>
                <tr><td style="padding: 8px 0; color: #7c3aed; font-weight: bold;">Subject:</td><td style="padding: 8px 0;">${cleanSubject}</td></tr>
              </table>
              <div style="background: #111827; padding: 16px; border-radius: 8px; border-left: 3px solid #00d4ff;">
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${cleanMessage}</p>
              </div>
              <p style="color: #333; font-size: 11px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #1a1a2e;">
                Sent via manibuildsai.com contact form
              </p>
            </div>
          `,
        }),
      });

      if (!resendResponse.ok) {
        const err = await resendResponse.text();
        console.error("Resend error:", err);
        return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
      }
    } else {
      // Log when no email service is configured (dev mode)
      console.info("[Contact Form]", {
        from: `${cleanName} <${email}>`,
        subject: cleanSubject,
        message: cleanMessage,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact route error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
