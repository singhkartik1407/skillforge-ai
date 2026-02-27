import { NextResponse } from "next/server";

type InsightResult = {
  strongest: string;
  weakest: string;
  careerSuggestion: string;
  recommendations: string[];
};

export async function POST(req: Request) {
  try {
    const { coding, aptitude, communication } = (await req.json()) as {
      coding?: number;
      aptitude?: number;
      communication?: number;
    };

    if (
      typeof coding !== "number" ||
      typeof aptitude !== "number" ||
      typeof communication !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
You are a career performance analyst.

You MUST respond with ONLY valid JSON.
Do NOT include markdown.
Do NOT include backticks.
Do NOT include explanations outside JSON.

Based on:

Coding Score: ${coding}
Aptitude Score: ${aptitude}
Communication Score: ${communication}

Analyze:
1. Strongest skill
2. Weakest skill
3. Suggested career path
4. 3 improvement recommendations

Return EXACTLY:

{
  "strongest": "",
  "weakest": "",
  "careerSuggestion": "",
  "recommendations": []
}
`;

    const response = await fetch(
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
            temperature: 0.3,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini REST Error (insight):", errorText);

      const fallback: InsightResult = {
        strongest: "",
        weakest: "",
        careerSuggestion: "",
        recommendations: ["Gemini API failed."],
      };

      return NextResponse.json(fallback);
    }

    const data = (await response.json()) as any;

    let rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^json/i, "")
      .trim();

    let parsed: InsightResult | null = null;

    try {
      parsed = JSON.parse(rawText) as InsightResult;
    } catch {
      const firstBrace = rawText.indexOf("{");
      const lastBrace = rawText.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        const possibleJson = rawText.substring(firstBrace, lastBrace + 1);
        try {
          parsed = JSON.parse(possibleJson) as InsightResult;
        } catch {
          parsed = null;
        }
      }
    }

    if (!parsed) {
      parsed = {
        strongest: "",
        weakest: "",
        careerSuggestion: "",
        recommendations: ["Unable to generate insight"],
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Server Error (insight):", error);

    const fallback: InsightResult = {
      strongest: "",
      weakest: "",
      careerSuggestion: "",
      recommendations: ["Unexpected server error occurred"],
    };

    return NextResponse.json(fallback);
  }
}

