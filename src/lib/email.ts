import emailjs from "@emailjs/browser";

const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ARTISAN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ARTISAN || "";
const EMAILJS_TEMPLATE_CLAIM = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CLAIM || "";

export async function sendArtisanRequestEmail(toEmail: string, data: {
  userName: string;
  userPhone: string;
  userEmail: string;
  artisanName: string;
  description: string;
}) {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ARTISAN) {
    console.warn("EmailJS not configured. Skipping email notification.");
    return { ok: false, error: "Email not configured" };
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ARTISAN,
      {
        to_email: toEmail,
        from_name: data.userName,
        from_email: data.userEmail,
        phone: data.userPhone,
        artisan_name: data.artisanName,
        message: data.description,
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    );
    return { ok: true };
  } catch (err: any) {
    console.error("Email send failed:", err);
    return { ok: false, error: err.message || "Email failed" };
  }
}

export async function sendClaimEmail(toEmail: string, data: {
  userName: string;
  userEmail: string;
  businessName: string;
  whatsapp: string;
  requestedPackage: string;
}) {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_CLAIM) {
    console.warn("EmailJS not configured. Skipping email notification.");
    return { ok: false, error: "Email not configured" };
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_CLAIM,
      {
        to_email: toEmail,
        from_name: data.userName,
        from_email: data.userEmail,
        business_name: data.businessName,
        whatsapp: data.whatsapp,
        package: data.requestedPackage,
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    );
    return { ok: true };
  } catch (err: any) {
    console.error("Email send failed:", err);
    return { ok: false, error: err.message || "Email failed" };
  }
}
