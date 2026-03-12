# MetaCraft — Guide de déploiement

## Stack
- **Frontend** — React + Vite, déployé sur **Vercel**
- **Auth + DB** — **Firebase** (Authentication + Firestore uniquement, pas de Storage)
- **Backend métadonnées** — Python FastAPI + ExifTool, déployé sur **Render**

> Les fichiers ne sont **jamais stockés** sur un serveur. Ils sont envoyés directement au backend Python,
> les métadonnées extractées sont sauvegardées dans Firestore, et le fichier modifié est
> renvoyé au navigateur pour téléchargement immédiat.

---

## 1. Firebase

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. **Authentication** → Sign-in method → activer **Email/Password** + **Google**
3. **Firestore Database** → créer en mode production, région `europe-west3`
4. Règles Firestore :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /files/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

5. **Project Settings** → Your apps → ajouter une app Web → copier les clés dans `.env`
6. **Project Settings** → Service accounts → **Générer une clé privée** → garder `serviceAccountKey.json`

---

## 2. Backend Python (Render)

1. Nouveau **Web Service** sur [render.com](https://render.com)
   - Root Directory : `backend`
   - Build Command : `pip install -r requirements.txt`
   - Start Command : `uvicorn main:app --host 0.0.0.0 --port $PORT`
2. **Secret Files** → uploader `serviceAccountKey.json` avec le chemin `/etc/secrets/serviceAccountKey.json`
3. Variables d’environnement :
   - `GOOGLE_APPLICATION_CREDENTIALS` → `/etc/secrets/serviceAccountKey.json`
   - `ALLOWED_ORIGIN` → `https://your-app.vercel.app`
4. Copier l’URL Render dans `VITE_PYTHON_API_URL`

---

## 3. Frontend (Vercel)

1. Importer le repo sur [vercel.com](https://vercel.com)
2. Ajouter les variables d’environnement (`VITE_*` de `.env.example`)
3. Deploy

---

## Développement local

```bash
# Frontend
cp .env.example .env   # remplir les clés Firebase
npm install
npm run dev

# Backend
cd backend
export GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
pip install -r requirements.txt
uvicorn main:app --reload
```
