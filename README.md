# 🚀 Backend MySQL - Kame Daay

Backend Node.js/Express avec MySQL pour l'application mobile Kame Daay.

## 📋 Prérequis

- Node.js 16+
- MySQL 8+
- Base de données `kame_daay` créée

## 🔧 Configuration

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Modifier le fichier `.env` :

```env
# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql_ici
DB_NAME=kame_daay
DB_PORT=3306

# JWT
JWT_SECRET=votre_secret_jwt_super_secure_minimum_32_caracteres
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:19006,http://localhost:8081,http://192.168.*.*
```

**⚠️ Important** : Changez `DB_PASSWORD` et `JWT_SECRET` !

### 3. Créer la base de données MySQL

```bash
mysql -u root -p
```

```sql
CREATE DATABASE kame_daay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kame_daay;
```

Puis exécuter le script SQL complet dans `/DEMARRAGE_RAPIDE_MYSQL.md` pour créer les 9 tables.

## 🚀 Démarrage

### Mode développement (avec auto-reload)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur http://localhost:3001

## 📡 API Endpoints

### Authentification

**POST** `/api/auth/signup`
```json
{
  "telephone": "77 123 45 67",
  "pin": "1234",
  "nom": "Diop",
  "prenom": "Fatou"
}
```

**POST** `/api/auth/login`
```json
{
  "telephone": "77 123 45 67",
  "pin": "1234"
}
```

### Synchronisation (authentification requise)

**POST** `/api/sync/all` - Synchroniser les données locales vers le serveur

Headers : `Authorization: Bearer <token>`

Body :
```json
{
  "clients": [...],
  "ventes": [...],
  "paiements": [...],
  "produits": [...],
  "templates": [...],
  "objectifs": [...],
  "depenses": [...],
  "rappels": [...]
}
```

**GET** `/api/sync/all` - Récupérer toutes les données du serveur

Headers : `Authorization: Bearer <token>`

### Health Check

**GET** `/api/health`

Retourne :
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T...",
  "env": "development"
}
```

## 🗄️ Structure

```
backend/
├── .env                    # Configuration
├── .gitignore
├── package.json
├── server.js               # Point d'entrée
├── config/
│   └── database.js         # Connexion MySQL
├── middleware/
│   └── auth.js             # Middleware JWT
└── routes/
    ├── auth.js             # Routes d'authentification
    └── sync.js             # Routes de synchronisation
```

## 🧪 Tests

### Test de connexion MySQL

```bash
node -e "require('./config/database')"
```

Devrait afficher : `✅ MySQL connected`

### Test de l'API

```bash
# Health check
curl http://localhost:3001/api/health

# Inscription
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "77 123 45 67",
    "pin": "1234",
    "nom": "Test",
    "prenom": "User"
  }'

# Connexion
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "77 123 45 67",
    "pin": "1234"
  }'
```

## 🐛 Dépannage

### Erreur : Cannot connect to MySQL

Vérifier que MySQL est démarré :
```bash
sudo systemctl status mysql
```

### Erreur : Access denied

Vérifier les identifiants dans `.env`

### Erreur : Database not found

Créer la base de données :
```bash
mysql -u root -p -e "CREATE DATABASE kame_daay"
```

### Port 3001 déjà utilisé

Modifier `PORT` dans `.env`

## 📊 Logs

Les logs s'affichent dans la console :
- ✅ Actions réussies (connexion, inscription, sync)
- ❌ Erreurs (avec détails)
- ⚠️  Avertissements

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Tokens expirables (7 jours par défaut)
- CORS configuré pour Expo Go
- Validation des données

## 📈 Production

Pour déployer en production, voir `/DEPLOIEMENT.md`

## 📞 Support

Voir la documentation complète :
- `/MYSQL_MOBILE_SETUP.md` - Configuration MySQL
- `/DEMARRAGE_RAPIDE_MYSQL.md` - Démarrage rapide
