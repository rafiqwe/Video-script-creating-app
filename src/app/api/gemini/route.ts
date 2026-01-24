import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  idea: z.string().min(5, "Idea should be at least 5 characters"),
  amount: z
    .number()
    .int()
    .min(1, "Amount must be at least 1 sentence")
    .max(200, "Amount cannot be more than 200 sentences"),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        message: "GEMINI_API_KEY is not set on the server.",
      },
      { status: 500 }
    );
  }

  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { idea, amount } = parsed.data;

    const systemText =
      `You are an AI script writer. The user will give you a short idea, and you must ` +
      `turn it into a clear script of EXACTLY ${amount} sentences (where amount is between 1 and 200). ` +
      `Each sentence should be easy to read and useful for video, narration, or article content.`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemText}\n\nUser idea: ${idea}`,
            },
          ],
        },
      ],
    };

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" +
        `?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Gemini API error", res.status, text);
      return NextResponse.json(
        {
          ok: false,
          message: "Gemini API request failed",
          status: res.status,
          details: process.env.NODE_ENV === "development" ? text : undefined,
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    const scriptText =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text || "")
        .join("") ?? "";

    return NextResponse.json(
      {
        ok: true,
        script: scriptText,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gemini generate error", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong while generating the script.",
      },
      { status: 500 }
    );
  }
}
