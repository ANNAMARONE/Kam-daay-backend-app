#!/usr/bin/env node

/**
 * Script de test des variables d'environnement
 * Vérifie que toutes les variables du .env sont correctement chargées
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('\n🔍 Test des Variables d\'Environnement');
console.log('=====================================\n');

const requiredVars = [
  { name: 'DB_HOST', description: 'Hôte MySQL', default: 'localhost' },
  { name: 'DB_USER', description: 'Utilisateur MySQL', default: 'root' },
  { name: 'DB_PASSWORD', description: 'Mot de passe MySQL', default: '(vide)', sensitive: true },
  { name: 'DB_NAME', description: 'Nom base de données', default: 'kame_daay' },
  { name: 'DB_PORT', description: 'Port MySQL', default: '3306' },
  { name: 'PORT', description: 'Port backend', default: '3001' },
  { name: 'NODE_ENV', description: 'Environnement', default: 'development' },
  { name: 'JWT_SECRET', description: 'Secret JWT', default: '(généré)', sensitive: true },
  { name: 'JWT_EXPIRES_IN', description: 'Expiration JWT', default: '7d' },
  { name: 'ALLOWED_ORIGINS', description: 'Origines CORS', default: 'localhost,192.168.*' }
];

let hasErrors = false;
let hasWarnings = false;

requiredVars.forEach(({ name, description, default: defaultVal, sensitive }) => {
  const value = process.env[name];
  
  if (value === undefined) {
    console.log(`❌ ${name.padEnd(20)} | ${description.padEnd(25)} | NON DÉFINIE`);
    hasErrors = true;
  } else if (value === '') {
    if (name === 'DB_PASSWORD') {
      console.log(`✅ ${name.padEnd(20)} | ${description.padEnd(25)} | (vide - OK si pas de mdp)`);
    } else {
      console.log(`⚠️  ${name.padEnd(20)} | ${description.padEnd(25)} | VIDE`);
      hasWarnings = true;
    }
  } else {
    const displayValue = sensitive ? '[masqué]' : value;
    const cleanValue = value.trim();
    
    if (value !== cleanValue) {
      console.log(`⚠️  ${name.padEnd(20)} | ${description.padEnd(25)} | "${displayValue}" (ESPACES DÉTECTÉS)`);
      hasWarnings = true;
    } else if (value.length !== cleanValue.length) {
      console.log(`⚠️  ${name.padEnd(20)} | ${description.padEnd(25)} | "${displayValue}" (CARACTÈRES INVISIBLES)`);
      hasWarnings = true;
    } else {
      console.log(`✅ ${name.padEnd(20)} | ${description.padEnd(25)} | ${displayValue}`);
    }
  }
});

console.log('\n=====================================');

if (hasErrors) {
  console.log('❌ Erreurs détectées ! Certaines variables sont manquantes.');
  console.log('   Lance : ./backend/fix-env.sh');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Avertissements détectés ! Certaines variables ont des problèmes.');
  console.log('   Lance : ./backend/fix-env.sh');
  process.exit(0);
} else {
  console.log('✅ Toutes les variables sont correctement définies !\n');
  process.exit(0);
}
