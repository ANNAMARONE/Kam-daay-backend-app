#!/bin/bash

# Script pour vérifier et corriger le fichier .env

echo "🔧 Vérification et correction du fichier .env"
echo "=============================================="
echo ""

ENV_FILE="backend/.env"

# Vérifier si le fichier existe
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Fichier .env introuvable"
    echo "📋 Création d'un nouveau fichier .env..."
    
    cat > "$ENV_FILE" << 'EOF'
# Base de Données MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=kame_daay
DB_PORT=3306

# Configuration Serveur
PORT=3001
NODE_ENV=development

# Sécurité JWT
JWT_SECRET=kame_daay_secret_key_change_me_in_production_123456789
JWT_EXPIRES_IN=7d

# CORS - Origines autorisées
ALLOWED_ORIGINS=http://localhost:*,http://192.168.*.*,exp://*
EOF
    
    echo "✅ Fichier .env créé avec succès"
    exit 0
fi

# Créer un fichier temporaire propre
TEMP_FILE="${ENV_FILE}.tmp"

echo "🔍 Nettoyage du fichier .env..."

# Nettoyer le fichier (supprimer espaces en fin de ligne, lignes vides multiples)
sed -e 's/[[:space:]]*$//' -e '/^$/N;/^\n$/D' "$ENV_FILE" > "$TEMP_FILE"

# Vérifier les variables critiques
echo ""
echo "📋 Vérification des variables..."

check_and_add() {
    var_name=$1
    default_value=$2
    
    if grep -q "^${var_name}=" "$TEMP_FILE"; then
        value=$(grep "^${var_name}=" "$TEMP_FILE" | cut -d'=' -f2-)
        if [ -z "$value" ] && [ -n "$default_value" ]; then
            echo "⚠️  $var_name vide, valeur par défaut ajoutée: $default_value"
            sed -i "s/^${var_name}=.*/${var_name}=${default_value}/" "$TEMP_FILE"
        else
            echo "✅ $var_name: OK"
        fi
    else
        echo "⚠️  $var_name manquant, ajout..."
        echo "${var_name}=${default_value}" >> "$TEMP_FILE"
    fi
}

# Vérifier et ajouter les variables manquantes
check_and_add "DB_HOST" "localhost"
check_and_add "DB_USER" "root"
check_and_add "DB_PASSWORD" ""
check_and_add "DB_NAME" "kame_daay"
check_and_add "DB_PORT" "3306"
check_and_add "PORT" "3001"
check_and_add "NODE_ENV" "development"
check_and_add "JWT_SECRET" "kame_daay_secret_key_change_me_in_production_123456789"
check_and_add "JWT_EXPIRES_IN" "7d"
check_and_add "ALLOWED_ORIGINS" "http://localhost:*,http://192.168.*.*,exp://*"

# Remplacer l'ancien fichier
mv "$TEMP_FILE" "$ENV_FILE"

echo ""
echo "✅ Fichier .env nettoyé et corrigé"
echo ""
echo "📄 Contenu final:"
echo "----------------"
cat "$ENV_FILE"
echo "----------------"
echo ""
echo "🎯 Redémarre maintenant le backend:"
echo "   cd backend && npm run dev"
