# MetaCraft — Guide de démarrage

## Prérequis
- Docker Desktop (ou Docker + Docker Compose)
- Node.js 20+
- Git

---

## 1. Générer les clés RSA (JWT RS256)

```bash
mkdir -p secrets
openssl genrsa -out secrets/jwt_private_key.pem 4096
openssl rsa -in secrets/jwt_private_key.pem -pubout -out secrets/jwt_public_key.pem
```

> ⚠️ Ne jamais committer le dossier `secrets/` — il est dans `.gitignore`

---

## 2. Configurer les variables d’environnement

```bash
cp .env.example .env
# Éditer .env et remplacer tous les `change_me_*`
```

---

## 3. Démarrer les backends

```bash
docker compose up --build -d
```

Services disponibles :
| Service | Port |
|---|---|
| Nginx (frontend + proxy) | http://localhost |
| Go API | interne :8000 |
| Python service | interne :8001 |
| R service | interne :8002 |
| MinIO console | http://localhost:9001 |

---

## 4. Démarrer le frontend (développement)

```bash
npm install
npm run dev
```

Le frontend tourne sur http://localhost:5173 et proxy les appels `/api` vers le backend Go.

---

## 5. Vérifier que tout fonctionne

```bash
# Health check Go
curl http://localhost:8000/api/health

# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@test.com","password":"Password123!"}'
```

---

## Sécurité en production

- Activer HTTPS : décommenter la ligne `return 301` dans `nginx/nginx.conf` et placer les certificats dans `nginx/ssl/`
- Mettre `GIN_MODE=release` (déjà configuré dans docker-compose)
- Passer `Secure: true` dans `backend-go/internal/storage/minio.go`
- Activer les backups PostgreSQL (`pg_dump` crônjob)
