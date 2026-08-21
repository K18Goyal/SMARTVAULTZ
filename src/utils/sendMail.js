const SPAM_NOTICE = "If you don't see this email in your inbox, please check your spam or junk folder.";
const BRAND = "SmartVaultz";

/** Format a Date for display in IST (Asia/Kolkata) so users see their local time in emails. */
function formatTimeInIST(date) {
  if (!(date instanceof Date)) return String(date);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function isMailConfigured() {
  return process.env.SMTP_USER && process.env.SMTP_PASS;
}

function buildOtpEmailHtml(otp, purpose) {
  const isForgot = purpose === "forgot";
  const title = isForgot ? "Reset your password" : "Verify your email";
  const intro = isForgot
    ? "Use the code below to set a new password for your SmartVaultz account."
    : "Use the code below to complete your SmartVaultz sign-up.";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} – SmartVaultz</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f2f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 440px;">
          <tr>
            <td style="padding: 32px 28px; background-color:#0D1B2A; border-radius: 16px 16px 0 0; text-align: center;">
              <span style="font-size: 22px; font-weight: 700; color: #E0E1DD; letter-spacing: -0.5px;">SmartVaultz</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px; background-color:#ffffff; border-radius: 0 0 16px 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0D1B2A;">${title}</h1>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.5; color: #778DA9;">${intro}</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 20px; background-color: #1B263B; border-radius: 12px;">
                    <span style="font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #E0E1DD;">${otp}</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0 0; font-size: 13px; line-height: 1.5; color: #778DA9;">Valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
              <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 1.5; color: #9ca3af;">${SPAM_NOTICE}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">© SmartVaultz. Secure locker booking.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendViaNodemailer(to, subject, html) {
  const nodemailer = require("nodemailer");
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = String(process.env.SMTP_SECURE).trim() === "true";
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();
  
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  
  const from = (process.env.EMAIL_FROM || '"SmartVaultz" <' + user + '>').trim();
  await transporter.sendMail({
    from,
    to: to.trim().toLowerCase(),
    subject,
    html,
  });
}

exports.sendOtpEmail = async (to, otp, purpose = "verification") => {
  const subject =
    purpose === "forgot"
      ? "SmartVaultz – Reset your password"
      : "SmartVaultz – Verify your email";
  const html = buildOtpEmailHtml(otp, purpose);

  if (!isMailConfigured()) {
    console.warn("Email not configured (set SMTP_USER); OTP would be:", otp);
    return true;
  }

  await sendViaNodemailer(to, subject, html);
  return true;
};

function buildBookingEmailHtml(title, message) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} – SmartVaultz</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f2f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 440px;">
          <tr>
            <td style="padding: 32px 28px; background-color:#0D1B2A; border-radius: 16px 16px 0 0; text-align: center;">
              <span style="font-size: 22px; font-weight: 700; color: #E0E1DD; letter-spacing: -0.5px;">SmartVaultz</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px; background-color:#ffffff; border-radius: 0 0 16px 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0D1B2A;">${title}</h1>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #778DA9;">${message}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">© SmartVaultz. Secure locker booking.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Send "10 minutes left" reminder (slot end in ≤10 min). Times shown in IST. */
exports.sendBookingReminderEmail = async (to, lockerLabel, endTime) => {
  const subject = "SmartVaultz – 10 minutes left on your locker booking";
  const endStr = formatTimeInIST(endTime);
  const message = `Your locker booking (${lockerLabel}) ends in about <strong>10 minutes</strong> (by ${endStr}). Please collect your items and close the locker before time runs out.`;
  const html = buildBookingEmailHtml("10 minutes left", message);

  if (!isMailConfigured()) {
    console.warn("Email not configured; booking reminder would be sent to:", to);
    return true;
  }
  await sendViaNodemailer(to, subject, html);
  return true;
};

/** Send "booking over" email, then caller should remove booking and release vault. */
exports.sendBookingOverEmail = async (to, lockerLabel) => {
  const subject = "SmartVaultz – Your locker booking has ended";
  const message = `Your booking for <strong>${lockerLabel}</strong> is now over. You have been removed from access to this locker. Thank you for using SmartVaultz.`;
  const html = buildBookingEmailHtml("Booking ended", message);

  if (!isMailConfigured()) {
    console.warn("Email not configured; booking over email would be sent to:", to);
    return true;
  }
  await sendViaNodemailer(to, subject, html);
  return true;
};

exports.getSpamNotice = () => SPAM_NOTICE;

exports.sendBookingConfirmationEmail = async (to, lockerLabel, amount, startTime, endTime) => {
  const subject = `SmartVaultz - Booking Confirmation (${lockerLabel})`;
  const startStr = formatTimeInIST(startTime);
  const endStr = formatTimeInIST(endTime);
  const message = `Your booking for <strong>${lockerLabel}</strong> is confirmed!<br/><br/>Amount Paid: ₹${amount}<br/>From: ${startStr}<br/>To: ${endStr}<br/><br/>Thank you for using SmartVaultz!`;
  const html = buildBookingEmailHtml("Booking Confirmed", message);

  if (!isMailConfigured()) {
    console.warn("Email not configured; booking confirmation would be sent to:", to);
    return true;
  }
  await sendViaNodemailer(to, subject, html);
  return true;
};

exports.sendLockerUnlockedEmail = async (to, lockerLabel) => {
  const subject = "SmartVaultz – Locker Unlocked";
  const message = `Your locker (<strong>${lockerLabel}</strong>) was just unlocked. If this was you, please ignore this email. If this was not you, please secure your account immediately.`;
  const html = buildBookingEmailHtml("Locker Unlocked", message);

  if (!isMailConfigured()) {
    console.warn("Email not configured; unlocked alert would be sent to:", to);
    return true;
  }
  await sendViaNodemailer(to, subject, html);
  return true;
};
