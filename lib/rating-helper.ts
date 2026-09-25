export function deriveRatingAndStep(text?: string): {
  rating: string;
  step: string;
} {
  if (!text) {
    return { rating: "7.5/10", step: "Discovery" };
  }

  // 1. Look for explicit numerical score out of 10 (e.g. 8.5/10, Score: 8/10, Viability: 9/10)
  const scoreRegex =
    /(?:rating|score|viability|feasibility)?[:\s*#]*\b([1-9](?:\.[0-9])?|10)\s*\/\s*10\b/i;
  const match = text.match(scoreRegex);
  if (match && match[1]) {
    const val = parseFloat(match[1]);
    let step = "Planning";
    if (val >= 8.0) step = "High Viability";
    else if (val >= 6.5) step = "Validation";
    else step = "Risk Review";
    return { rating: `${match[1]}/10`, step };
  }

  // 2. Look for letter grade (A+, A, B+, B, C)
  const gradeMatch = text.match(
    /(?:rating|score|grade)[:\s*#]*\b([A-D][+-]?)\b/i
  );
  if (gradeMatch && gradeMatch[1]) {
    const grade = gradeMatch[1].toUpperCase();
    const step = grade.startsWith("A")
      ? "High Viability"
      : grade.startsWith("B")
      ? "Validation"
      : "Risk Review";
    return { rating: grade, step };
  }

  // 3. Qualitative analysis from n8n response sentiment
  const lower = text.toLowerCase();
  if (
    lower.includes("high potential") ||
    lower.includes("strongly viable") ||
    lower.includes("highly profitable") ||
    lower.includes("strong demand") ||
    lower.includes("excellent potential")
  ) {
    return { rating: "8.6/10", step: "High Viability" };
  }
  if (
    lower.includes("viable") ||
    lower.includes("positive return") ||
    lower.includes("promising") ||
    lower.includes("good margin") ||
    lower.includes("sustainable")
  ) {
    return { rating: "7.8/10", step: "Validation" };
  }
  if (
    lower.includes("moderate risk") ||
    lower.includes("careful planning") ||
    lower.includes("tight margins") ||
    lower.includes("break-even in") ||
    lower.includes("feasibility")
  ) {
    return { rating: "6.8/10", step: "Feasibility" };
  }
  if (
    lower.includes("high risk") ||
    lower.includes("low viability") ||
    lower.includes("challenging") ||
    lower.includes("significant barriers") ||
    lower.includes("heavy competition")
  ) {
    return { rating: "5.4/10", step: "Risk Review" };
  }

  return { rating: "7.7/10", step: "Analysis" };
}

export function getRatingColor(rating: string): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  const numMatch = rating.match(/([0-9]+(?:\.[0-9]+)?)/);
  const num = numMatch ? parseFloat(numMatch[1]) : null;

  if (num !== null) {
    if (num >= 8.0) {
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200/80",
        badge: "Strong",
      };
    }
    if (num >= 6.5) {
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200/80",
        badge: "Viable",
      };
    }
    return {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200/80",
      badge: "Caution",
    };
  }

  if (rating.startsWith("A")) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200/80",
      badge: "Strong",
    };
  }
  if (rating.startsWith("B")) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200/80",
      badge: "Viable",
    };
  }

  return {
    bg: "bg-zinc-100",
    text: "text-zinc-700",
    border: "border-zinc-200",
    badge: "Evaluating",
  };
}
