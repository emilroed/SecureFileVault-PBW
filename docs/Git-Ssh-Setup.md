# 🚀 Git & SSH Opsætning Guide

## 📌 Introduktion

Denne guide hjælper dig med at opsætte SSH til GitHub, så du kan pushe til repositories uden at skulle indtaste login-oplysninger hver gang.

---

## 🔐 1. Opret en SSH-nøgle (kun én gang pr. bruger)

Hvis du ikke allerede har en SSH-nøgle, generér en ny:

```bash
ssh-keygen -t ed25519 -C "din-email@domæne.com"
```

Tryk **Enter** for at gemme nøglen i standardmappen (`~/.ssh/id_ed25519`).

Tilføj derefter nøglen til din **SSH-agent**:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

---

## 🔗 2. Tilføj din SSH-nøgle til GitHub

1. Kopiér din offentlige nøgle til clipboard:

   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. Gå til **GitHub** → **Settings** → **SSH and GPG keys**.
3. Klik **"New SSH key"**.
4. Indsæt din offentlige nøgle og klik **"Add SSH Key"**.
5. Test forbindelsen:

   ```bash
   ssh -T git@github.com
   ```

   Hvis det virker, får du beskeden:

   ```
   Hi <your-username>! You've successfully authenticated.
   ```

---

## 📂 3. Opsæt SSH for et nyt GitHub-repo

### **A. Klon repo direkte med SSH** (anbefalet)

```bash
git clone git@github.com:DIN-BRUGERNAVN/NAVN-PÅ-REPO.git
cd NAVN-PÅ-REPO
```

Nu kan du arbejde i repoet og bruge `git push` uden login.

### **B. Skift fra HTTPS til SSH** (hvis repoet allerede er klonet via HTTPS)

```bash
git remote set-url origin git@github.com:DIN-BRUGERNAVN/NAVN-PÅ-REPO.git
```

Bekræft ændringen:

```bash
git remote -v
```

Output skal vise noget i denne stil:

```
origin  git@github.com:DIN-BRUGERNAVN/NAVN-PÅ-REPO.git (fetch)
origin  git@github.com:DIN-BRUGERNAVN/NAVN-PÅ-REPO.git (push)
```

---

## 🚀 4. Arbejde med Git & SSH

### **A. Tilføj og commit filer**

```bash
git add .
git commit -m "Tilføjet ændringer"
```

### **B. Push ændringer (kun første gang i en ny branch)**

```bash
git push -u origin main
```

Efter første gang kan du bare bruge:

```bash
git push
```

### **C. Hent ændringer fra GitHub**

```bash
git pull origin main
```

Hvis du arbejder på en anden branch:

```bash
git push -u origin feature-branch
```

---

## 🔄 5. Fejlfinding

### **1. Git beder stadig om login?**

Sørg for, at din SSH-nøgle er tilføjet til din SSH-agent:

```bash
ssh-add ~/.ssh/id_ed25519
```

### **2. Test om SSH virker korrekt**

```bash
ssh -T git@github.com
```

Hvis du får beskeden _"You've successfully authenticated"_, er din opsætning korrekt!

---

## 🎯 Konklusion

✅ **SSH-nøgle opsættes én gang per bruger.**  
✅ **Hvert nyt repo skal have sin remote sat til SSH.**  
✅ **Efter første push kan du bruge `git push` uden ekstra flags.**  
✅ **SSH gør arbejdet med GitHub hurtigere og sikrere!** 🚀

---

💡 **Nu kan du arbejde med GitHub udelukkende via terminalen i VSC uden at skulle indtaste credentials hver gang!** 😊
