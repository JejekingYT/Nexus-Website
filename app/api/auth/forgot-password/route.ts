import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: cleanEmail,
      },
    });

    // Don't reveal whether an email exists.
    if (!user) {
      return NextResponse.json({
        success: true,
      });
    }

    // Delete old reset tokens
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Create new token
    const token = crypto
      .randomBytes(32)
      .toString("hex");

    const expiresAt = new Date(
      Date.now() + 60 * 60 * 1000
    );

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const resetUrl =
      `${baseUrl}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Nexus <onboarding@resend.dev>",
      to: [cleanEmail],
      subject: "Reset your Nexus password",
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
                Reset your
                <span style="color: #a855f7;">
                  Nexus
                </span>
                password
              </h1>

              <p style="color: #a1a1aa;">
                Hey ${user.username},
              </p>

              <p style="
                color: #a1a1aa;
                line-height: 1.6;
              ">
                We received a request to reset your Nexus
                password. Click the button below to create
                a new password.
              </p>

              <div style="
                text-align: center;
                margin: 35px 0;
              ">

                <a
                  href="${resetUrl}"
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
                  Reset Password
                </a>

              </div>

              <p style="
                color: #71717a;
                font-size: 13px;
                line-height: 1.5;
              ">
                This link expires in 1 hour.
                If you didn't request a password reset,
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

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}