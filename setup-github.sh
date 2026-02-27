#!/bin/bash
# ─────────────────────────────────────────────────
# AskHippocrates – GitHub Setup Script
# ─────────────────────────────────────────────────
# Verwendung:
#   chmod +x setup-github.sh
#   ./setup-github.sh DEIN-GITHUB-USERNAME
# ─────────────────────────────────────────────────

USERNAME=${1:?"Bitte GitHub-Username angeben: ./setup-github.sh DEIN-USERNAME"}
REPO="ask-hippocrates"

echo "⚕️  Erstelle GitHub-Repository: $USERNAME/$REPO"
echo ""

# Git initialisieren
git init
git add .
git commit -m "🏛️ Initial commit – AskHippocrates: Medizinethik-Chatbot"

# Erstelle das Repo über GitHub CLI (falls installiert)
if command -v gh &> /dev/null; then
  gh repo create "$REPO" --public --source=. --remote=origin --push \
    --description "Medizinethik-Chatbot im Geiste des Hippokrates"
  echo ""
  echo "✅ Fertig! Dein Repo: https://github.com/$USERNAME/$REPO"
else
  echo ""
  echo "📋 GitHub CLI (gh) nicht gefunden."
  echo "   Erstelle das Repo manuell auf https://github.com/new"
  echo "   Name: $REPO"
  echo ""
  echo "   Dann führe aus:"
  echo "   git remote add origin https://github.com/$USERNAME/$REPO.git"
  echo "   git branch -M main"
  echo "   git push -u origin main"
fi
