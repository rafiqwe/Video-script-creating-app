import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { Script } from "@/lib/models/Script";
import { verifyAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

const saveSchema = z.object({
  idea: z.string().min(5),
  amount: z.number().int().min(1).max(200),
  content: z.string().min(1),
});

function getUserIdFromCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = verifyAuthToken(token);
  return payload?.userId ?? null;
}

export async function GET() {
  try {
    await connectToDatabase();

    const userId = getUserIdFromCookie();

    const query: Record<string, unknown> = {};
    if (userId) {
      query.userId = userId;
    }

    const scripts = await Script.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json(
      {
        ok: true,
        scripts: scripts.map((s) => ({
          id: s._id.toString(),
          idea: s.idea,
          amount: s.amount,
          content: s.content,
          createdAt: s.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch scripts error", error);
    return NextResponse.json(
      { ok: false, message: "Failed to load scripts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = saveSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const userId = getUserIdFromCookie();

    await connectToDatabase();

    const { idea, amount, content } = parsed.data;

    const script = await Script.create({
      userId: userId ?? undefined,
      idea,
      amount,
      content,
    });

    return NextResponse.json(
      {
        ok: true,
        script: {
          id: script._id.toString(),
          idea: script.idea,
          amount: script.amount,
          content: script.content,
          createdAt: script.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save script error", error);
    return NextResponse.json(
      { ok: false, message: "Failed to save script." },
      { status: 500 }
    );
  }
}
