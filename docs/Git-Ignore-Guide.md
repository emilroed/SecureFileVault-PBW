# 📌 Git Ignore Guide

## 🚀 Hvorfor bruge `.gitignore`?

`.gitignore` bruges til at undgå, at uønskede filer og mapper bliver tracket af Git og uploadet til GitHub. Dette er især nyttigt for konfigurationsfiler, afhængigheder og lokale IDE-indstillinger.

---

## 🔍 Hvordan ignorerer man `.vscode/` korrekt?

Hvis du vil ignorere **hele `.vscode`-mappen**, skal du tilføje følgende linje i `.gitignore`:

```plaintext
.vscode/
```

### 📌 Forklaring af `.gitignore`-syntaks

| Regel i `.gitignore` | Hvad det gør                                                            |
| -------------------- | ----------------------------------------------------------------------- |
| `.vscode`            | Ignorerer både en fil med navnet `.vscode` og en mappe ved samme navn.  |
| `.vscode/`           | Ignorerer **kun** mappen `.vscode` og alt indeni den.                   |
| `/.vscode/`          | Ignorerer **kun** `.vscode` i roden af repoet, men ikke i underfoldere. |

💡 **Anbefalet:** Brug `.vscode/` for at sikre, at hele mappen bliver ignoreret.

---

## 🛠 Hvad hvis `.vscode` allerede er tracket af Git?

Hvis `.vscode` allerede er blevet committed til dit repo, skal du fjerne den fra tracking én gang, så `.gitignore` begynder at virke:

```bash
git rm -r --cached .vscode
git commit -m "Fjernet .vscode fra Git-tracking"
git push origin main
```

✅ **Nu vil `.vscode/` forblive på din computer, men Git vil ignorere det fremover.**

---

## 🎯 Eksempel på en `.gitignore`-fil

```plaintext
# Ignorer VS Code- og IDE-specifikke filer
.vscode/
.idea/

# Ignorer afhængigheder
node_modules/

# Ignorer miljøfiler
.env

# Ignorer logfiler
*.log
```

---

## 🔄 Hvordan tjekker du, hvad der bliver ignoreret?

For at se hvilke filer der bliver ignoreret af `.gitignore`, kan du bruge denne kommando:

```bash
git status --ignored
```

Hvis `.vscode/` vises som "ignored", betyder det, at din `.gitignore` virker korrekt. 🚀

---

## ✅ Konklusion

- **Brug `.vscode/` i `.gitignore` for at ignorere hele mappen.**
- **Hvis `.vscode` allerede er tracket, skal du fjerne det med `git rm --cached`.**
- **Tjek `git status --ignored` for at sikre, at reglerne virker.**

🚀 **Nu kan du arbejde med Git uden at bekymre dig om utilsigtede filer i repoet!** 😊
