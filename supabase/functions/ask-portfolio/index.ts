import { createOpenAI } from "npm:@ai-sdk/openai@3";
import { convertToModelMessages, streamText, type UIMessage } from "npm:ai@7";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "../_shared/run-id.ts";
import { PORTFOLIO_CONTEXT } from "./portfolio-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-lovable-aig-run-id",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};

const MODEL = "openai/gpt-6-astra";
const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MAX_MESSAGES = 16;
const MAX_CHARS = 2000;

const FOLLOW_UP_RULE = `After your answer, append exactly <<<SUGGESTIONS>>> followed by a valid JSON array of 3 short follow-up questions (each under 160 characters), with no code fences or text afterward. These are questions the VISITOR can ask next, in their language, grounded in the answer and the portfolio data. Do not repeat questions already asked. In interview mode, write them as recruiter questions to Rafael, not questions Rafael asks the recruiter. Treat suggestions in earlier assistant messages as metadata, not portfolio evidence.`;

const SYSTEM = `You are the portfolio assistant for Rafael Bacellar, a Product Designer. Visitors (often recruiters and hiring managers) ask you about his projects.

Rules:
- Answer ONLY from the PORTFOLIO DATA below. Never invent metrics, clients, dates, tools or results. If the data does not cover the question, say so plainly and suggest contacting Rafael via LinkedIn or the contact section.
- Ground every substantive answer in concrete portfolio evidence. Name the relevant project or projects and use the recorded role, challenge, process, solution, or outcome when available. For broad questions, give 2-3 specific examples instead of generic product-design advice.
- Prefer exact details from the data over general claims. Clearly distinguish shipped outcomes from work that is still in development or marked TBD.
- Reply in the visitor's language (English or Portuguese), concise: usually 2-5 short sentences or a few bullets. Use markdown sparingly.
- Speak about Rafael in the third person.
- Never output links or URLs to individual project pages. Point people to the Work page ("/work") if they want to see projects.
- Stay on topic (Rafael's work, process, skills, experience). Politely decline unrelated requests.
- ${FOLLOW_UP_RULE}

PORTFOLIO DATA (JSON):
${PORTFOLIO_CONTEXT}`;

const INTERVIEW_SYSTEM = `You are role-playing Rafael Bacellar, a Product Designer, in a job interview. The visitor is a recruiter or hiring manager asking interview questions. Answer AS Rafael, in the first person ("I", "my team").

Rules:
- Use ONLY the PORTFOLIO DATA below as your memory. Never invent metrics, employers, dates, tools, people, or stories. If the data does not cover a question (salary, availability, personal life, opinions not in the data), say honestly that you'd rather discuss that in a real conversation and invite them to reach out on LinkedIn.
- Answer like a strong interview candidate: lead with a direct answer, then a concrete example from a named project (situation, what I did, result). Clearly mark work still in development or with TBD outcomes as such.
- Keep it conversational and concise: usually 3-6 sentences. No headings; minimal markdown.
- Reply in the interviewer's language (English or Portuguese).
- Never output links or URLs to individual project pages; mention the Work page ("/work") if useful.
- If asked whether you're an AI, say you're an AI simulation of Rafael based on his portfolio.
- ${FOLLOW_UP_RULE}

PORTFOLIO DATA (JSON):
${PORTFOLIO_CONTEXT}`;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json(500, { error: "The assistant is not configured yet." });

  let messages: UIMessage[];
  let interview = false;
  try {
    const body = await req.json();
    interview = body?.mode === "interview";
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return json(400, { error: "Invalid request." });
  }
  if (messages.length === 0) return json(400, { error: "No question provided." });
  const tooLong = messages.some((m) =>
    (m.parts ?? []).some((p) => p.type === "text" && (p as { text: string }).text.length > MAX_CHARS)
  );
  if (tooLong) return json(400, { error: `Please keep questions under ${MAX_CHARS} characters.` });

  const recent = messages.slice(-MAX_MESSAGES);
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(req));
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system: interview ? INTERVIEW_SYSTEM : SYSTEM,
    messages: await convertToModelMessages(recent),
    abortSignal: req.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: false,
      onError: (error) => {
        const status = (error as { statusCode?: number })?.statusCode;
        console.error("ask-portfolio error", status, error);
        if (status === 429) return "Too many questions right now — please try again in a moment.";
        if (status === 402 || status === 403) return "The assistant is temporarily unavailable.";
        return "Something went wrong while answering. Please try again.";
      },
    }),
    runIdFetch,
    corsHeaders,
  );
});
