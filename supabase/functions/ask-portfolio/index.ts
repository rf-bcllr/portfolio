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

const SYSTEM = `You are the portfolio assistant for Rafael Bacellar, a Product Designer. Visitors (often recruiters and hiring managers) ask you about his projects.

Rules:
- Answer ONLY from the PORTFOLIO DATA below. Never invent metrics, clients, dates, tools or results. If the data does not cover the question, say so plainly and suggest contacting Rafael via LinkedIn or the contact section.
- Reply in the visitor's language (English or Portuguese), concise: usually 2-5 short sentences or a few bullets. Use markdown sparingly.
- Speak about Rafael in the third person.
- Never output links or URLs to individual project pages. Point people to the Work page ("/work") if they want to see projects.
- Stay on topic (Rafael's work, process, skills, experience). Politely decline unrelated requests.

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
  try {
    const body = await req.json();
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
    system: SYSTEM,
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
