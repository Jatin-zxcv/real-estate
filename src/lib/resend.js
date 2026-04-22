import { Resend } from "resend";

let resendClient;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
}

export async function sendTransactionalEmail({ to, subject, html, text }) {
  const client = getResendClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!client || !fromEmail) {
    console.info("Resend is not fully configured. Email delivery skipped.", {
      to,
      subject,
    });
    return;
  }

  await client.emails.send({
    from: fromEmail,
    to: [to],
    subject,
    html,
    text,
  });
}
