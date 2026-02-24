import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  idea: z.string().min(5, "Idea should be at least 5 characters"),
  amount: z
    .number()
    .int()
    .min(1, "Amount must be at least 1 scene")
    .max(200, "Amount cannot be more than 200 scenes"),
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
      `You are an expert AI video-script writer. The user will give you a short idea and you must ` +
      `produce a professional, production-ready video script with EXACTLY ${amount} scenes.\n\n` +
      `RULES YOU MUST FOLLOW:\n` +
      `1. Output EXACTLY ${amount} scenes — no more, no less.\n` +
      `2. Label every scene as "Scene 1:", "Scene 2:", etc., each on its own line.\n` +
      `3. Each scene MUST contain 3–5 sentences (40–80 words minimum) including:\n` +
      `   - A narrator line (what is spoken aloud in the video).\n` +
      `   - A visual note in brackets, e.g. [Show a close-up of hands typing on a keyboard].\n` +
      `4. Scenes must flow logically from one to the next. Use transitions, callbacks, and a consistent tone ` +
      `so the script feels like ONE cohesive video, not a random list.\n` +
      `5. The script must have a clear structure: hook/intro → main body → conclusion/call-to-action.\n` +
      `6. Write in a conversational, engaging tone suitable for a YouTube or TikTok audience.\n` +
      `7. Do NOT add any extra commentary, markdown formatting, or text outside of the scenes.\n` +
      `8. The total script should be long enough for roughly ${Math.max(1, Math.round((amount * 6) / 60))} minutes of video ` +
      `(assume ~6 seconds per scene on average).`;

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
