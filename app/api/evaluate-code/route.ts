import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question, language, code } = await req.json();

    if (!question || !language || !code) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

  const prompt = `
  You are a strict technical coding interviewer.
  Please evaluate the following solution.
  Question:
  ${question}
  Language:
  ${language}
  Code:
  ${code}
  Return EXACTLY this JSON format:
    
  You MUST respond with ONLY valid JSON.
  Do NOT include markdown.
  Do NOT include backticks.
  Do NOT include the word "json".
  Do NOT include explanations.
  Do NOT include any text before or after JSON.
  If you fail to follow this, the system will break.
    
  Evaluate the following solution.
    
  Question:
  ${question}
    
  Language:
  ${language}
    
  Code:
  ${code}
    
  Return EXACTLY this JSON format:
    
  {
    "score": 0,
    "correctness": "",
    "timeComplexity": "",
    "codeQuality": "",
    "suggestions": []
  }
    
  All values must be filled.
  Score must be between 0 and 10.
  Suggestions must be an array of strings.
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
            maxOutputTokens: 1500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini REST Error:", errorText);

      return NextResponse.json({
        score: 5,
        correctness: "AI temporarily unavailable",
        timeComplexity: "Unknown",
        codeQuality: "Fallback response",
        suggestions: ["Gemini API failed."],
      });
    }
    const data = await response.json();

    let rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean markdown wrappers
    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^json/i, "")
      .trim();

    console.log("RAW GEMINI OUTPUT:", rawText);

    
    let parsed: any = null;
    
    // 1️⃣ Try direct parse first
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // 2️⃣ Try extracting from first { to last }
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
    
    // 3️⃣ Only fallback if parsing truly fails
    if (!parsed) {
      parsed = {
        score: 0,
        correctness: "Unable to evaluate response",
        timeComplexity: "Unknown",
        codeQuality: "Needs review",
        suggestions: ["AI returned unexpected format"]
      };
    }
    
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json({
      score: 5,
      correctness: "Server error",
      timeComplexity: "Unknown",
      codeQuality: "Fallback response",
      suggestions: ["Unexpected server error occurred."],
    });
  }
}