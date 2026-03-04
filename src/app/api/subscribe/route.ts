import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// POST /api/subscribe — subscribe to the newsletter
export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Already subscribed" });
  }

  const confirmToken = randomBytes(32).toString("hex");

  await prisma.subscriber.create({
    data: { email, name: name || null, confirmToken },
  });

  // TODO: send confirmation email via Resend
  // For now, auto-confirm
  await prisma.subscriber.update({
    where: { email },
    data: { confirmed: true, confirmToken: null },
  });

  return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
}
