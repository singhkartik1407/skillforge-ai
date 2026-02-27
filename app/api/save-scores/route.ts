import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { coding, aptitude, communication, overall } = await req.json();

    const { data, error } = await supabase.from("user_scores").insert([
      {
        user_id: "anonymous",
        coding_score: coding,
        aptitude_score: aptitude,
        communication_score: communication,
        overall_score: overall,
      },
    ]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

