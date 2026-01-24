import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { signAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const token = signAuthToken({ userId: user._id.toString(), email: user.email });

    const res = NextResponse.json(
      {
        ok: true,
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
        token,
      },
      { status: 200 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
