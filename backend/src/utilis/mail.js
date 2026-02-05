import axios from "axios";

const brevoApiKey = process.env.BREVO_API_KEY;
const fromEmail = process.env.BREVO_FROM_EMAIL;
const fromName = process.env.BREVO_FROM_NAME || "GoRides";

export const sendEmail = async (to, subject, text) => {
  if (!brevoApiKey || !fromEmail) {
    throw new Error("Missing BREVO_API_KEY or BREVO_FROM_EMAIL");
  }
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: fromName, email: fromEmail },
        to: [{ email: to }],
        subject,
        textContent: text,
      },
      {
        headers: {
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
      },
    );
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error?.response?.data || error);
    throw new Error("Email could not be sent");
  }
};
