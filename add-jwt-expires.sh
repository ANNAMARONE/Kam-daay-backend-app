#!/bin/bash

# Script ultra-simple pour ajouter JWT_EXPIRES_IN

echo "🔧 Ajout de JWT_EXPIRES_IN dans .env"
echo "====================================="
echo ""

# Vérifier si on est dans le bon dossier
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env introuvable dans ce dossier"
    echo "   Assure-toi d'être dans le dossier backend/"
    exit 1
fi

# Vérifier si JWT_EXPIRES_IN existe déjà
if grep -q "^JWT_EXPIRES_IN=" ".env"; then
    echo "✅ JWT_EXPIRES_IN existe déjà dans .env"
    current_value=$(grep "^JWT_EXPIRES_IN=" ".env" | cut -d'=' -f2-)
    echo "   Valeur actuelle: $current_value"
    
    # Si vide, remplacer
    if [ -z "$current_value" ]; then
        echo "⚠️  Valeur vide, remplacement par 7d"
        sed -i 's/^JWT_EXPIRES_IN=.*/JWT_EXPIRES_IN=7d/' ".env"
        echo "✅ JWT_EXPIRES_IN=7d ajouté"
    fi
else
    echo "⚠️  JWT_EXPIRES_IN manquant, ajout..."
    echo "JWT_EXPIRES_IN=7d" >> ".env"
    echo "✅ JWT_EXPIRES_IN=7d ajouté"
fi

echo ""
echo "📄 Vérification du fichier .env:"
echo "--------------------------------"
cat .env
echo "--------------------------------"
echo ""
echo "✅ Terminé !"
echo ""
echo "🎯 Prochaines étapes:"
echo "   1. Vérifie: node test-env.js"
echo "   2. Redémarre: npm run dev"
