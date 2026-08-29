import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?error=missing-token", request.url)
      );
    }

    const verificationToken =
      await prisma.emailVerificationToken.findUnique({
        where: {
          token,
        },
      });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/login?error=invalid-token", request.url)
      );
    }

    // Check expiration
    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: {
          id: verificationToken.id,
        },
      });

      return NextResponse.redirect(
        new URL("/login?error=expired-token", request.url)
      );
    }

    // Verify the user's email
    await prisma.user.update({
      where: {
        id: verificationToken.userId,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete the token so it cannot be used again
    await prisma.emailVerificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });

    return NextResponse.redirect(
      new URL("/login?verified=true", request.url)
    );
  } catch (error) {
    console.error("EMAIL_VERIFICATION_ERROR:", error);

    return NextResponse.redirect(
      new URL("/login?error=verification-failed", request.url)
    );
  }
}