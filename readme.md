# 🔐 Secure File Storage – Opgave 6

**Sikker filopbevaring med AES-256 kryptering**

![AES-256 Encryption](https://img.shields.io/badge/Encryption-AES--256-blue)  
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)  
![Database](https://img.shields.io/badge/Database-SQLite-yellow)  
![API](https://img.shields.io/badge/API-REST-orange)

---

## 📉 **1. Projektbeskrivelse**

Dette projekt er en **REST API**, der giver brugere mulighed for at **uploade, kryptere, hente og dekryptere filer** på en sikker måde.  
Filer **krypteres automatisk med AES-256**, og **kun brugere med den rigtige dekrypteringsnøgle kan læse dem igen**.

### **🔹 Projektets hovedfunktioner:**

✅ **Upload en fil → Filen krypteres automatisk med AES-256.**  
✅ **Gem metadata i SQLite-database (filnavn, IV, dato).**  
✅ **Kun brugere med den korrekte dekrypteringsnøgle kan dekryptere filerne.**  
✅ **API’et er beskyttet med en API-nøgle for sikkerhed.**

---

## 📂 **2. Projektstruktur**

```bash
SecureFileStorage/
├── .env                   # 📉 Miljøvariabler (AES-nøgle, PORT)
├── uploads/               # 📉 Krypterede filer gemmes her
├── database.js            # 📉 SQLite database til filmetadata
├── controllers/
│   ├── fileController.js  # 📉 Håndtering af upload & download
├── middleware/
│   ├── apiAuth.js         # 📉 API-nøgle autentificering
├── routes/
│   ├── fileRoutes.js      # 📉 Ruter til upload/download
├── server.js              # 📉 Express-server
├── package.json           # 📉 NPM afhængigheder
├── README.md              # 📉 Denne dokumentation
```

---

## 📚 **3. Teknologier & Pakker**

| 📚 **Pakkenavn** | 🔍 **Beskrivelse**                                  |
| ---------------- | --------------------------------------------------- |
| `express`        | Webserver til REST API.                             |
| `dotenv`         | Håndterer miljøvariabler (AES-nøgle, PORT).         |
| `multer`         | Middleware til håndtering af filuploads.            |
| `crypto`         | Node.js' indbyggede krypteringsbibliotek (AES-256). |
| `fs`             | Node.js' filhåndtering (gemme/læse filer).          |
| `better-sqlite3` | SQLite-database til metadata om filer.              |

---

## 🔑 **4. Kryptering & Dekryptering i Projektet**

Vi bruger **AES-256-CBC**, som er en **blokeringsbaseret symmetrisk kryptering**.

### **🔹 Hvorfor AES-256-CBC?**

- **AES-256 er industristandard for stærk kryptering**.
- **CBC (Cipher Block Chaining) sikrer, at selv identiske filer krypteres forskelligt.**
- **IV (Initialization Vector) gør det umuligt at gætte indholdet af en fil baseret på mønstre**.

### **🔐 Krypteringsfunktion**

```javascript
function encrypt(buffer) {
  let iv = crypto.randomBytes(16); // ✅ Unik IV pr. fil
  let cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { iv: iv.toString("hex"), data: encrypted.toString("hex") };
}
```

### **🔒 Dekrypteringsfunktion**

```javascript
function decrypt(text, iv) {
  let ivBuffer = Buffer.from(iv, "hex");
  let encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, ivBuffer);
  let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted;
}
```

---

## 📉 **5. API-ruter & Brug af `curl`**

### 📂 **Upload en fil**

```sh
curl -X POST http://localhost:3000/api/files/upload \
     -H "x-api-key: 827efe6921efb5f7f96cf7a64c4787df" \
     -F "file=@test.txt"
```

### 📅 **Download en krypteret fil**

```sh
curl -X POST http://localhost:3000/api/files/download/171234567890-test.txt.enc \
     -H "x-api-key: 827efe6921efb5f7f96cf7a64c4787df" \
     -o decrypted_test.txt
```

---

## 📈 **6. Metadata-gemning i SQLite**

| ID  | Filnavn    | Krypteret filnavn           | IV                 | Upload dato           |
| --- | ---------- | --------------------------- | ------------------ | --------------------- |
| 1   | `test.txt` | `171234567890-test.txt.enc` | `abcdef1234567890` | `2024-06-12 14:30:00` |

> 🔹 **Filens indhold gemmes ikke i databasen, kun metadata!**

---

## 🔐 **7. API-sikkerhed med API-nøgle**

API’et kræver en **gyldig API-nøgle**, som sendes med hver anmodning.

---

## 📉 **8. Konklusion**

✔ **AES-256 sikrer, at kun autoriserede brugere kan læse filer.**  
✔ **SQLite holder styr på metadata.**  
✔ **API-nøgler beskytter mod uautoriseret adgang.**  
✔ **Systemet er designet så enkelt som muligt.**

🎯 **Dette projekt leverer en sikker og REST-baseret filopbevaringstjeneste.**  
🚀 **Skole Projekt!** 😊
