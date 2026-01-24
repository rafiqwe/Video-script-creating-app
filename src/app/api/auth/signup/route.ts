import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { signAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = signupSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parseResult.data;

    await connectToDatabase();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          message: "A user with this email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    const token = signAuthToken({ userId: user._id.toString(), email: user.email });

    const res = NextResponse.json(
      {
        ok: true,
        message: "Account created successfully.",
        token,
      },
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Signup error", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
