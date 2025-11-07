#!/bin/bash

# Script de test du backend Kame Daay

echo "🔍 Test du Backend Kame Daay"
echo "=============================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1 : Fichier .env existe
echo "1️⃣  Vérification du fichier .env..."
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Fichier .env existe${NC}"
else
    echo -e "${RED}❌ Fichier .env manquant${NC}"
    echo "   Crée-le avec : cp backend/.env.example backend/.env"
    exit 1
fi

# Test 2 : Variables importantes
echo ""
echo "2️⃣  Vérification des variables..."

check_var() {
    var_name=$1
    var_value=$(grep "^$var_name=" backend/.env | cut -d'=' -f2-)
    
    if [ -z "$var_value" ]; then
        echo -e "${YELLOW}⚠️  $var_name : non définie${NC}"
        return 1
    else
        if [ "$var_name" = "DB_PASSWORD" ] || [ "$var_name" = "JWT_SECRET" ]; then
            echo -e "${GREEN}✅ $var_name : [masqué]${NC}"
        else
            echo -e "${GREEN}✅ $var_name : $var_value${NC}"
        fi
        return 0
    fi
}

check_var "DB_HOST"
check_var "DB_USER"
check_var "DB_PASSWORD"
check_var "DB_NAME"
check_var "DB_PORT"
check_var "PORT"
check_var "NODE_ENV"
check_var "JWT_SECRET"
check_var "JWT_EXPIRES_IN"
check_var "ALLOWED_ORIGINS"

# Test 3 : MySQL accessible
echo ""
echo "3️⃣  Test de connexion MySQL..."

DB_HOST=$(grep "^DB_HOST=" backend/.env | cut -d'=' -f2)
DB_USER=$(grep "^DB_USER=" backend/.env | cut -d'=' -f2)
DB_NAME=$(grep "^DB_NAME=" backend/.env | cut -d'=' -f2)
DB_PASS=$(grep "^DB_PASSWORD=" backend/.env | cut -d'=' -f2)

if command -v mysql &> /dev/null; then
    if [ -z "$DB_PASS" ]; then
        mysql -h"$DB_HOST" -u"$DB_USER" -e "SELECT 1;" 2>/dev/null
    else
        mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1;" 2>/dev/null
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ MySQL accessible${NC}"
    else
        echo -e "${RED}❌ MySQL non accessible${NC}"
        echo "   Vérifie que MySQL tourne dans XAMPP/WAMP"
    fi
else
    echo -e "${YELLOW}⚠️  Client MySQL non trouvé${NC}"
fi

# Test 4 : Base de données existe
echo ""
echo "4️⃣  Vérification de la base de données..."

if command -v mysql &> /dev/null; then
    if [ -z "$DB_PASS" ]; then
        result=$(mysql -h"$DB_HOST" -u"$DB_USER" -e "SHOW DATABASES LIKE '$DB_NAME';" 2>/dev/null | grep "$DB_NAME")
    else
        result=$(mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" -e "SHOW DATABASES LIKE '$DB_NAME';" 2>/dev/null | grep "$DB_NAME")
    fi
    
    if [ -n "$result" ]; then
        echo -e "${GREEN}✅ Base de données '$DB_NAME' existe${NC}"
    else
        echo -e "${RED}❌ Base de données '$DB_NAME' n'existe pas${NC}"
        echo "   Crée-la avec phpMyAdmin : http://localhost/phpmyadmin"
    fi
fi

# Test 5 : Backend répond
echo ""
echo "5️⃣  Test du backend..."

PORT=$(grep "^PORT=" backend/.env | cut -d'=' -f2)

# Vérifier si le backend tourne
if curl -s http://localhost:$PORT/api/health > /dev/null 2>&1; then
    response=$(curl -s http://localhost:$PORT/api/health)
    echo -e "${GREEN}✅ Backend répond${NC}"
    echo "   $response"
else
    echo -e "${RED}❌ Backend ne répond pas${NC}"
    echo "   Le backend est-il démarré ? (cd backend && npm run dev)"
fi

echo ""
echo "=============================="
echo "Diagnostic terminé"
echo ""
