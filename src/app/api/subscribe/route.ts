import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  // Single upsert: create if not exists, noop if already subscribed
  const subscriber = await prisma.subscriber.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: name || null,
      // Auto-confirm until email flow is implemented
      confirmed: true,
      confirmToken: null,
    },
  });

  if (subscriber.confirmed) {
    return NextResponse.json({ message: "Already subscribed" });
  }

  // TODO: send confirmation email via Resend
  return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
}
