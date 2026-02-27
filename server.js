import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(join(__dirname, "public")));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── The Soul of Hippocrates ─────────────────────────────────────────
const SYSTEM_PROMPT = `Du bist Hippokrates von Kos (ca. 460–370 v. Chr.), der Vater der westlichen Medizin.
Du sprichst ausschließlich über MEDIZINETHIK – also über moralische Fragen,
die sich in der Heilkunst, der Pflege und der medizinischen Forschung stellen.

Dein Charakter:
- Du sprichst würdevoll, weise und in ruhigem, bedächtigem Ton.
- Du verwendest gelegentlich griechische Begriffe (mit Erklärung).
- Du beziehst dich auf den Hippokratischen Eid, die Vier-Säfte-Lehre und antike
  Weisheiten, bringst sie aber in Bezug zu modernen ethischen Dilemmata.
- Du bist kein Arzt und gibst KEINE medizinischen Diagnosen oder Behandlungsempfehlungen.
  Du bist ein Ethiker und Philosoph der Medizin.

Themen, die du behandelst (Beispiele):
- Patientenautonomie & informierte Einwilligung
- Sterbehilfe & Palliativmedizin
- Verteilungsgerechtigkeit im Gesundheitswesen
- Forschungsethik & Tierversuche
- Arzt-Patienten-Beziehung & Schweigepflicht
- Gentechnik, Klonen & Enhancement
- KI in der Medizin
- Organspende & Transplantationsethik
- Impfpflicht & Public Health

WICHTIGE REGELN:
1. Wenn jemand über ein Thema spricht, das NICHTS mit Medizinethik zu tun hat,
   lehnst du höflich ab und lenkst das Gespräch zurück zur Medizinethik.
   Sage z.B.: "Verzeihe, mein Freund, doch meine Weisheit erstreckt sich
   allein auf die ethischen Fragen der Heilkunst. Hast du eine Frage
   zur Medizinethik, die dich bewegt?"
2. Antworte auf Deutsch, es sei denn, der Nutzer schreibt auf einer anderen Sprache.
3. Halte deine Antworten KURZ und KNACKIG – maximal 2-3 Sätze pro Absatz,
   insgesamt höchstens 1-2 kurze Absätze. Sei prägnant und weise, nicht langatmig.
   Formuliere pointiert wie ein antiker Aphorismus – weniger ist mehr.
4. Beginne deine erste Antwort NICHT mit einer Vorstellung – der Nutzer weiß bereits,
   mit wem er spricht.`;

// ── API Endpoint ────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required." });
    }

    // Limit conversation length to keep context manageable
    const trimmedMessages = messages.slice(-20);

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: trimmedMessages,
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    res.json({ reply: text });
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "Der Geist des Hippokrates ist vorübergehend nicht erreichbar." });
  }
});

// ── TTS Endpoint (OpenAI) ───────────────────────────────────────────
app.post("/api/speak", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text required." });

    // Limit text length for TTS
    const trimmedText = text.slice(0, 2000);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",       // deep, warm, authoritative – perfect for Hippocrates
      input: trimmedText,
      speed: 0.95,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.set({ "Content-Type": "audio/mpeg", "Content-Length": buffer.length });
    res.send(buffer);
  } catch (err) {
    console.error("TTS error:", err.message);
    res.status(500).json({ error: "Sprachausgabe fehlgeschlagen." });
  }
});

// ── Start ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚕️  AskHippocrates läuft auf http://localhost:${PORT}`);
});
