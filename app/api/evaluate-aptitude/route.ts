import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question, options, selectedAnswer } = await req.json();

    if (!question || !options || !selectedAnswer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
You are a quantitative aptitude expert.

You MUST respond with ONLY valid JSON.
Do NOT include markdown.
Do NOT include backticks.
Do NOT include the word "json".
Do NOT include explanations outside JSON.
If you fail to follow this, the system will break.

Question:
${question}

Options:
${options.join("\n")}

Selected Answer:
${selectedAnswer}

Evaluate:
1. Whether the selected answer is correct (true/false)
2. Provide the correct answer
3. Provide a clear explanation
4. Rate difficulty as Easy, Medium, or Hard

Return EXACTLY this JSON format:

{
  "isCorrect": true,
  "correctAnswer": "",
  "explanation": "",
  "difficulty": ""
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
            temperature: 0.2,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini REST Error (aptitude):", errorText);

      return NextResponse.json({
        isCorrect: false,
        correctAnswer: "",
        explanation: "AI temporarily unavailable",
        difficulty: "Unknown",
      });
    }

    const data = await response.json();

    let rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^json/i, "")
      .trim();

    console.log("RAW GEMINI OUTPUT (aptitude):", rawText);

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
        isCorrect: false,
        correctAnswer: "",
        explanation: "Unable to evaluate response",
        difficulty: "Unknown",
      };
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Server Error (aptitude):", error);

    return NextResponse.json({
      isCorrect: false,
      correctAnswer: "",
      explanation: "Unexpected server error occurred",
      difficulty: "Unknown",
    });
  }
}

