"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // ==========================================
  // VALIDATION
  // ==========================================

  if (!username || !email || !password || !confirmPassword) {
    throw new Error("Please fill in all fields.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanUsername.length < 3) {
    throw new Error("Username must be at least 3 characters.");
  }

  // ==========================================
  // CHECK EMAIL
  // ==========================================

  const existingEmail = await prisma.user.findUnique({
    where: {
      email: cleanEmail,
    },
  });

  if (existingEmail) {
    throw new Error("An account with this email already exists.");
  }

  // ==========================================
  // CHECK USERNAME
  // ==========================================

  const existingUsername = await prisma.user.findFirst({
    where: {
      username: cleanUsername,
    },
  });

  if (existingUsername) {
    throw new Error("This username is already taken.");
  }

  // ==========================================
  // HASH PASSWORD
  // ==========================================

  const hashedPassword = await bcrypt.hash(password, 12);

  // ==========================================
  // CREATE USER
  // ==========================================

  const user = await prisma.user.create({
    data: {
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,

      discordId: null,
      robloxId: null,

      role: "USER",

      // Email is NOT verified yet
      emailVerified: null,
    },
  });

  // ==========================================
  // CREATE VERIFICATION TOKEN
  // ==========================================

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  // ==========================================
  // CREATE VERIFICATION URL
  // ==========================================

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  const verificationUrl =
    `${baseUrl}/api/auth/verify-email?token=${token}`;

  // ==========================================
  // SEND VERIFICATION EMAIL
  // ==========================================

  await sendVerificationEmail({
    email: cleanEmail,
    username: cleanUsername,
    verificationUrl,
  });

  // ==========================================
  // REDIRECT
  // ==========================================

  redirect("/login?registered=true");
}