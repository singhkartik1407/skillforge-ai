import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { response } = await req.json();

    if (!response) {
      return NextResponse.json(
        { error: "Missing response text" },
        { status: 400 }
      );
    }

    const prompt = `
You are a professional English communication coach.

You MUST respond with ONLY valid JSON.
Do NOT include markdown.
Do NOT include backticks.
Do NOT include the word "json".
Do NOT include explanations.
Do NOT include any text before or after JSON.
If you fail to follow this, the system will break.

Evaluate the following communication response:

${response}

Score strictly between 0 and 100.

Return EXACTLY this JSON format:

{
  "grammar": 0,
  "clarity": 0,
  "confidence": 0,
  "vocabulary": 0,
  "overall": 0,
  "suggestions": []
}

All numeric values must be between 0 and 100.
Suggestions must be an array of strings.
`;

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2500,
          },
        }),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Gemini REST Error (communication):", errorText);

      return NextResponse.json({
        grammar: 0,
        clarity: 0,
        confidence: 0,
        vocabulary: 0,
        overall: 0,
        suggestions: ["AI temporarily unavailable"],
      });
    }

    const data = await apiResponse.json();

    let rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean markdown wrappers
    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^json/i, "")
      .trim();

    console.log("RAW GEMINI OUTPUT (communication):", rawText);

    let parsed: any = null;

    // Try direct parse
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const firstBrace = rawText.indexOf("{");
      const lastBrace = rawText.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1) {
        const possibleJson = rawText.substring(firstBrace, lastBrace + 1);
        try {
          parsed = JSON.parse(possibleJson);
        } catch {
          parsed = null;
        }
      }
    }

    if (!parsed) {
      parsed = {
        grammar: 0,
        clarity: 0,
        confidence: 0,
        vocabulary: 0,
        overall: 0,
        suggestions: ["AI returned unexpected format"],
      };
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Server Error (communication):", error);

    return NextResponse.json({
      grammar: 0,
      clarity: 0,
      confidence: 0,
      vocabulary: 0,
      overall: 0,
      suggestions: ["Unexpected server error occurred"],
    });
  }
}