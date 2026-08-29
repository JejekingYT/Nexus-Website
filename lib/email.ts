import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail({
  email,
  username,
  verificationUrl,
}: {
  email: string;
  username: string;
  verificationUrl: string;
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ||
     "Nexus <onboarding@resend.dev>",

    to: [email],

    subject: "Verify your Nexus email",
    
    html: `
      <!DOCTYPE html>
      <html>
        <body style="
          margin: 0;
          padding: 0;
          background: #09090b;
          color: white;
          font-family: Arial, sans-serif;
        ">

          <div style="
            max-width: 600px;
            margin: 40px auto;
            padding: 40px;
            background: #111118;
            border: 1px solid #27272a;
            border-radius: 20px;
          ">

            <h1>
              Welcome to
              <span style="color: #a855f7;">
                Nexus
              </span>
            </h1>

            <p style="color: #a1a1aa;">
              Hey ${username},
            </p>

            <p style="
              color: #a1a1aa;
              line-height: 1.6;
            ">
              Thanks for creating your Nexus account.
              Please verify your email address by clicking
              the button below.
            </p>

            <div style="
              text-align: center;
              margin: 35px 0;
            ">

              <a
                href="${verificationUrl}"
                style="
                  display: inline-block;
                  padding: 14px 28px;
                  background: #9333ea;
                  color: white;
                  text-decoration: none;
                  border-radius: 10px;
                  font-weight: bold;
                "
              >
                Verify Email
              </a>

            </div>

            <p style="
              color: #71717a;
              font-size: 13px;
              line-height: 1.5;
            ">
              This verification link expires in 24 hours.
              If you didn't create a Nexus account,
              you can safely ignore this email.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #27272a;
              margin: 30px 0;
            " />

            <p style="
              color: #52525b;
              font-size: 12px;
              text-align: center;
            ">
              Nexus Community Platform
            </p>

          </div>

        </body>
      </html>
    `,
  });

  if (error) {
    console.error("RESEND_ERROR:", error);
    throw new Error("Failed to send verification email.");
  }

  return data;
}