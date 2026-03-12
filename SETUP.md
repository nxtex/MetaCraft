# MetaCraft — Guide de déploiement

## Stack
- **Frontend** — React + Vite, deployé sur **Vercel**
- **Auth + DB + Storage** — **Firebase** (Authentication, Firestore, Storage)
- **Backend métadonnées** — Python FastAPI + ExifTool, déployé sur **Render**

---

## 1. Firebase

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. **Authentication** → Sign-in method → activer **Email/Password** + **Google**
3. **Firestore Database** → créer une base en mode production
4. Ajoutez ces règles Firestore :

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

5. **Storage** → créer un bucket + règles :

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. **Project Settings** → Your apps → copier les clés dans `.env` (voir `.env.example`)
7. Téléchargez `serviceAccountKey.json` (Project Settings → Service accounts → Generate new private key)

---

## 2. Backend Python (Render)

1. Poussez le dossier `backend/` sur un repo (ou utilisez ce repo)
2. Créez un **Web Service** sur [render.com](https://render.com)
   - Root Directory : `backend`
   - Build Command : `pip install -r requirements.txt`
   - Start Command : `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Variables d’environnement sur Render :
   - `GOOGLE_APPLICATION_CREDENTIALS` → chemin vers votre `serviceAccountKey.json` (uploadez-le comme Secret File)
   - `FIREBASE_STORAGE_BUCKET` → `your-project.appspot.com`
   - `ALLOWED_ORIGIN` → `https://your-vercel-app.vercel.app`
4. Copiez l’URL Render dans `VITE_PYTHON_API_URL` de votre `.env` Vercel

---

## 3. Frontend (Vercel)

1. Importez le repo sur [vercel.com](https://vercel.com)
2. Ajoutez toutes les variables `VITE_*` de `.env.example` dans les settings Vercel
3. Deploy

---

## Développement local

```bash
# Frontend
cp .env.example .env  # remplir les clés Firebase
npm install
npm run dev

# Backend
cd backend
export GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
export FIREBASE_STORAGE_BUCKET=your-project.appspot.com
uvicorn main:app --reload
```
