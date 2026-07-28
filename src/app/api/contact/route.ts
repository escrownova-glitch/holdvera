import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HoldVera Contact <support@holdvera.site>",
        to: "support@holdvera.site",
        reply_to: email,
        subject: `[HoldVera Contact] ${subject} - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37 0%, #C9A227 50%, #B8860B 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${subject}</td>
                </tr>
              </table>
              <div style="margin-top: 20px;">
                <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
                <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            <div style="background: #1a1a1a; color: #888; padding: 20px; text-align: center; font-size: 12px;">
              <p>This email was sent from the HoldVera contact form.</p>
              <p>© ${new Date().getFullYear()} HoldVera. Trust. Secure. Delivered.</p>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to send email");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
