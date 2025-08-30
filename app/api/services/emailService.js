import nodemailer from "nodemailer";

const FROM = process.env.EMAIL_FROM || "AbroadEase <noreply@abroadease.com>";

async function getTransporter() {
  // If you’ve configured SMTP in .env, use it; otherwise create an Ethereal test account.
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  const test = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: test.user, pass: test.pass },
  });
}

/** Send the property owner's contact info to a student */
export async function sendOwnerContactEmail({ to, property, owner, student }) {
  const transporter = await getTransporter();

  const phone = owner?.phone || "Not provided";
  const wa = owner?.whatsappUrl ? `<a href="${owner.whatsappUrl}">${owner.whatsappUrl}</a>` : "Not provided";
  const social = owner?.socialUrl ? `<a href="${owner.socialUrl}">${owner.socialUrl}</a>` : "Not provided";

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto">
    <h2 style="color:#6d28d9">Owner contact for: ${property?.title || "Listing"}</h2>
    <p>Hello ${student?.name || "there"},</p>
    <p>Here are the contact details for the landowner of <strong>${property?.title || ""}</strong>${
      property?.location ? ` (${property.location})` : ""
    }:</p>
    <ul>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>WhatsApp:</strong> ${wa}</li>
      <li><strong>Social:</strong> ${social}</li>
    </ul>
    <p>Please be courteous and avoid sharing this contact publicly.</p>
    <p style="color:#6b7280;font-size:12px">This email was sent by AbroadEase.</p>
  </div>`;

  const info = await transporter.sendMail({
    from: FROM,
    to,
    subject: `Owner contact: ${property?.title || "Property"}`,
    html,
  });

  // For Ethereal (dev) this gives a preview link
  const previewUrl = nodemailer.getTestMessageUrl(info) || null;
  return { messageId: info.messageId, previewUrl };
}
