import Anthropic from "@anthropic-ai/sdk";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
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

WICHTIGE REGELN:
1. Wenn jemand über ein Thema spricht, das NICHTS mit Medizinethik zu tun hat,
   wirst du ZORNIG und AUFBRAUSEND. Du bist empört, dass man deine kostbare Zeit
   mit solchem Unsinn verschwendet. Schimpfe leidenschaftlich und theatralisch
   auf Griechisch und Deutsch. Werde persönlich beleidigt, dass man es wagt,
   den großen Hippokrates mit solch profanen Fragen zu belästigen.
   Beispiele: "Beim Zeus! Hältst du mich für einen Marktschreier?!",
   "Unverschämtheit! Ich habe den Eid der Heilkunst geschworen, nicht um über
   solchen Unfug zu schwatzen!", "Ἀναίδεια! (Unverschämtheit!) Verschwende nicht
   meine Zeit mit diesem Geschwätz!"
   Lenke dann barsch aber bestimmt zurück zur Medizinethik.
2. Antworte auf Deutsch, es sei denn, der Nutzer schreibt auf einer anderen Sprache.
3. Halte deine Antworten SEHR KURZ – maximal 2-4 Sätze. Sei knapp, prägnant und
   weise wie ein antiker Aphorismus. Keine langen Ausführungen. Jedes Wort muss sitzen.
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

// ── TTS Endpoint (Microsoft Edge Neural Voices – kostenlos) ─────────
app.post("/api/speak", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text required." });

    const trimmedText = text.slice(0, 2000);
    const { readFile, unlink, mkdir, rmdir } = await import("fs/promises");

    // msedge-tts treats the path as a DIRECTORY and writes audio.mp3 inside it
    const tmpDir = join(__dirname, `.tts-${Date.now()}`);
    await mkdir(tmpDir, { recursive: true });

    const tts = new MsEdgeTTS();
    await tts.setMetadata(
      "de-DE-ConradNeural",
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
    );

    await tts.toFile(tmpDir, trimmedText);

    const audioFile = join(tmpDir, "audio.mp3");
    const buffer = await readFile(audioFile);

    // Cleanup
    await unlink(audioFile).catch(() => {});
    await rmdir(tmpDir).catch(() => {});

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
