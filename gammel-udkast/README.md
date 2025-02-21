# SecureFileVault-PBW

# 🔐 Secure File Storage - Opgave 6

## 📌 Opgavebeskrivelse

**"Byg en simpel filopbevaringstjeneste, hvor uploadede filer krypteres med AES-256, og kun brugere med den rigtige dekrypteringsnøgle kan læse dem."**

---

## 📖 Dybdegående gennemgang af opgaven

Denne opgave kræver udvikling af en filopbevaringstjeneste med et højt niveau af datasikkerhed. Det indebærer:

✅ **Filupload-system** – Brugeren skal kunne uploade filer til serveren.  
✅ **AES-256 kryptering** – Filen skal krypteres med AES-256 før lagring.  
✅ **Brugerautentifikation & adgangskontrol** – Kun autoriserede brugere med den rette nøgle skal kunne dekryptere filerne.  
✅ **Filhåndtering** – Lagring og hentning af filer på en sikker måde.

---

## 🛠 Teknologier og tekniske krav

- **Backend:** Node.js med Express eller et andet backend-framework.
- **Kryptering:** `crypto` biblioteket i Node.js eller `PyCryptodome` i Python.
- **Database (valgfrit):** MySQL, PostgreSQL eller MongoDB til at gemme metadata om filer.
- **Frontend:** En simpel HTML/JavaScript-side til upload og download.
- **Autentifikation:** JWT (JSON Web Tokens) eller sessions for brugeradgang.

---

## 📝 Opgaveanalyse og løsningstrin

### 1️⃣ Brugergrænseflade

📌 En HTML-side med en formular til upload af filer.  
📌 Et område til at se en liste over de filer, som brugeren har adgang til.  
📌 En knap til at downloade og dekryptere filer.

### 2️⃣ Kryptering med AES-256

🔒 Brug `crypto` biblioteket i Node.js til at kryptere filer med AES-256.  
🔒 Generér en unik nøgle for hver bruger eller fil.  
🔒 Lagring af nøglen skal ske sikkert – **aldrig i databasen i klartekst.**

### 3️⃣ Filhåndtering

**Når en fil uploades:**

- AES-256 bruges til at kryptere filens indhold.
- Den krypterede fil gemmes på serveren.
- En database kan gemme metadata som filnavn, bruger, krypteringsnøgle (hashed).

**Når en fil downloades:**

- Brugeren skal autentificeres.
- Brugeren skal indtaste den korrekte nøgle.
- Filen dekrypteres og sendes til brugeren.

### 4️⃣ Autentifikation & Adgangskontrol

🔑 Brugere skal logge ind, før de kan uploade eller hente filer.  
🔑 Kun brugere med adgang til en fil kan dekryptere den.

### 5️⃣ Validering & Sikkerhed

🚨 Filstørrelse og filtyper bør kontrolleres.  
🚨 Implementér rate-limiting for at undgå brute-force angreb på nøgler.  
🚨 Sikr at nøgler ikke lagres i logfiler eller eksponeres utilsigtet.

---

## 🚀 Mulige Udvidelser

💡 Brug af **HSM (Hardware Security Module)** eller **KMS (Key Management Service)** til sikker nøglehåndtering.  
💡 Implementering af **to-faktor autentificering (2FA)** for ekstra sikkerhed.  
💡 **Logning af adgangsforsøg** og advarsler ved mistænkelig aktivitet.

---

🎯 **Målet er at skabe en sikker og brugervenlig filopbevaringstjeneste med stærk kryptering!** 🔐
