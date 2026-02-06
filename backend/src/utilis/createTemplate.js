export const createEmailTemplate = (otp, isForgotPassword, user) => {
  const title = isForgotPassword ? "Password Reset" : "Email Verification";
  const heading = isForgotPassword
    ? "Reset Your Password"
    : "Verify Your Email";
  const description = isForgotPassword
    ? "We received a request to reset your password. Use the OTP below to proceed with resetting your password."
    : "Thank you for signing up! Please verify your email address using the OTP below to complete your registration.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0"
style="max-width:520px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td style="background:#10b981;padding:14px 18px;text-align:center;">
<h1 style="margin:0 !important;padding:0;color:#ffffff;font-size:22px;font-weight:600;">
${heading}
</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:14px 18px;">
<p style="margin:0 0 6px !important;padding:0;color:#4b5563;font-size:14px;">
Hello${user.username ? " " + user.username : ""},
</p>

<p style="margin:0 0 10px !important;padding:0;color:#4b5563;font-size:14px;line-height:1.5;">
${description}
</p>

<!-- OTP Box -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#d1fae5;border:2px solid #10b981;border-radius:8px;margin:10px 0;padding:0;">
<tr>
<td style="padding:10px;text-align:center;margin:0;">
<p style="margin:0 0 5px !important;padding:0;font-size:12px;color:#065f46;font-weight:600;letter-spacing:1px;">
YOUR VERIFICATION CODE
</p>
<table width="auto" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;margin:0 auto;padding:0;">
<tr>
<td style="padding:6px 12px;text-align:center;">
<p style="margin:0 !important;padding:0;font-size:28px;font-weight:700;color:#10b981;letter-spacing:4px;font-family:Courier New,monospace;">
${otp}
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>

<!-- Expiry -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border-left:4px solid #f59e0b;margin:8px 0;padding:0;">
<tr>
<td style="padding:7px 10px;margin:0;">
<p style="margin:0 !important;padding:0;font-size:13px;color:#92400e;">
⏰ <strong>Important:</strong> This code expires in <strong>10 minutes</strong>.
</p>
</td>
</tr>
</table>

<!-- Security -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:6px;margin:8px 0;padding:0;">
<tr>
<td style="padding:9px 10px;margin:0;">
<p style="margin:0 0 3px !important;padding:0;font-size:13px;color:#374151;font-weight:600;">
Security Notice:
</p>
<ul style="margin:3px 0 0 18px !important;padding:0;font-size:13px;color:#6b7280;line-height:1.4;">
<li style="margin:2px 0 !important;padding:0;">Do not share this code with anyone</li>
<li style="margin:2px 0 !important;padding:0;">GoRides will never ask for your OTP</li>
<li style="margin:2px 0 !important;padding:0;">${
    isForgotPassword
      ? "If you didn't request a password reset, please ignore this email"
      : "If you didn't attempt to verify your email, please ignore this message"
  }</li>
</ul>
</td>
</tr>
</table>

<p style="margin:8px 0 0 0 !important;padding:0;font-size:13px;color:#6b7280;">
Best regards,<br>
<strong style="color:#10b981;">GoRides Team</strong>
</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:10px 18px;text-align:center;margin:0;">
<p style="margin:0 0 2px !important;padding:0;font-size:11px;color:#9ca3af;">
This is an automated email. Please do not reply.
</p>
<p style="margin:0 !important;padding:0;font-size:11px;color:#9ca3af;">
© ${new Date().getFullYear()} GoRides. All rights reserved.
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
</html>
`.trim();
};
