# 🏛️ AskHippocrates

> *Medizinethik im Geiste des Hippokrates*

Ein themengebundener Chatbot, der Fragen zur Medizinethik beantwortet – im würdevollen Ton des Hippokrates von Kos, dem Vater der westlichen Medizin.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

## Was macht AskHippocrates?

- 🧠 Beantwortet Fragen zu **Medizinethik** (Sterbehilfe, Patientenautonomie, KI in der Medizin, Organspende, …)
- 🏛️ Spricht im Stil des **Hippokrates** – würdevoll, weise, mit gelegentlichen griechischen Begriffen
- 🚫 Lehnt themenfremde Fragen höflich ab und lenkt zurück zur Ethik
- ⚕️ Gibt **keine medizinischen Diagnosen** – nur ethische Reflexion

## Schnellstart

### Voraussetzungen

- [Node.js](https://nodejs.org/) 18+
- Ein [Anthropic API Key](https://console.anthropic.com/)

### Installation

```bash
# Repository klonen
git clone https://github.com/DEIN-USERNAME/ask-hippocrates.git
cd ask-hippocrates

# Abhängigkeiten installieren
npm install

# API-Key konfigurieren
cp .env.example .env
# → .env öffnen und ANTHROPIC_API_KEY eintragen

# Server starten
npm start
```

Öffne dann **http://localhost:3000** im Browser.

## Projektstruktur

```
ask-hippocrates/
├── server.js          # Express-Server mit Anthropic API
├── public/
│   └── index.html     # Chat-Interface (Single-Page)
├── .env.example       # Umgebungsvariablen-Vorlage
├── package.json
└── README.md
```

## Anpassen

Das Projekt ist als **Vorlage** gedacht. Du kannst es leicht für andere Themen umbauen:

1. **`server.js`** → `SYSTEM_PROMPT` ändern (Persona, Thema, Regeln)
2. **`public/index.html`** → Design, Farben, Vorschlagsfragen anpassen

### Beispiel-Ideen

| Thema | Persona |
|-------|---------|
| Philosophie | Sokrates |
| Physik | Albert Einstein |
| Klassische Musik | Wolfgang Amadeus Mozart |
| Literatur | Johann Wolfgang von Goethe |

## Technologie

- **Backend:** Node.js + Express
- **AI:** Claude (Anthropic API)
- **Frontend:** Vanilla HTML/CSS/JS – keine Build-Tools nötig

## Lizenz

MIT – siehe [LICENSE](LICENSE).

---

*»Primum non nocere.« – Erstens: nicht schaden.*
