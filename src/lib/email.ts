export async function sendContactEmail(toEmail: string, data: {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}) {
  try {
    const res = await fetch(`https://formsubmit.co/${encodeURIComponent(toEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `[Espace Meknès] Contact - ${data.subject}`,
        Nom: data.name,
        Email: data.email,
        Catégorie: data.category,
        Sujet: data.subject,
        Message: data.message,
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: "Failed" };
  } catch (err: any) {
    console.error("Email send failed:", err);
    return { ok: false, error: err.message || "Email failed" };
  }
}

export async function sendArtisanRequestEmail(toEmail: string, data: {
  userName: string;
  userPhone: string;
  userEmail: string;
  artisanName: string;
  description: string;
}) {
  try {
    const res = await fetch(`https://formsubmit.co/${encodeURIComponent(toEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `[Espace Meknès] Nouvelle demande artisan de ${data.userName}`,
        Nom: data.userName,
        Téléphone: data.userPhone,
        Email: data.userEmail,
        Artisan: data.artisanName,
        Description: data.description,
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: "Failed" };
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
  try {
    const res = await fetch(`https://formsubmit.co/${encodeURIComponent(toEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `[Espace Meknès] Nouvelle réclamation - ${data.businessName}`,
        Nom: data.userName,
        Email: data.userEmail,
        Commerce: data.businessName,
        WhatsApp: data.whatsapp,
        Package: data.requestedPackage,
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: "Failed" };
  } catch (err: any) {
    console.error("Email send failed:", err);
    return { ok: false, error: err.message || "Email failed" };
  }
}
