/**
 * Script de vérification de la base de données MySQL
 * Affiche le nombre de clients, ventes, etc. pour un utilisateur donné
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const USER_ID = 'cfd36388-2af8-4741-ab6f-c4e87f0b3e98'; // ID utilisateur par défaut

async function checkDatabase() {
  console.log('🔍 VÉRIFICATION BASE DE DONNÉES MYSQL\n');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kame_daay'
  });

  try {
    console.log('✅ Connexion réussie à MySQL\n');

    // Compter les clients
    const [clients] = await connection.execute(
      'SELECT COUNT(*) as count FROM clients WHERE user_id = ?',
      [USER_ID]
    );
    console.log(`👥 Clients: ${clients[0].count}`);

    // Récupérer tous les clients avec détails
    const [clientsList] = await connection.execute(
      'SELECT id, nom, prenom, telephone FROM clients WHERE user_id = ? ORDER BY created_at DESC',
      [USER_ID]
    );
    
    if (clientsList.length > 0) {
      console.log('\n📋 Liste des clients:');
      clientsList.forEach((c, i) => {
        console.log(`  ${i + 1}. ${c.prenom} ${c.nom} - ${c.telephone} (UUID: ${c.id.substring(0, 8)}...)`);
      });
    }

    // Compter les ventes
    const [ventes] = await connection.execute(
      'SELECT COUNT(*) as count FROM ventes WHERE user_id = ?',
      [USER_ID]
    );
    console.log(`\n💰 Ventes: ${ventes[0].count}`);

    // Récupérer les ventes avec détails
    const [ventesList] = await connection.execute(
      `SELECT v.id, v.client_id, v.montant, v.date_vente, c.prenom, c.nom
       FROM ventes v
       LEFT JOIN clients c ON v.client_id = c.id
       WHERE v.user_id = ?
       ORDER BY v.date_vente DESC`,
      [USER_ID]
    );

    if (ventesList.length > 0) {
      console.log('\n📋 Liste des ventes:');
      ventesList.forEach((v, i) => {
        const clientName = v.prenom && v.nom ? `${v.prenom} ${v.nom}` : 'Client supprimé';
        const date = new Date(v.date_vente).toLocaleDateString('fr-FR');
        console.log(`  ${i + 1}. ${clientName} - ${v.montant} FCFA (${date})`);
      });
    }

    // Compter les paiements
    const [paiements] = await connection.execute(
      'SELECT COUNT(*) as count FROM paiements WHERE user_id = ?',
      [USER_ID]
    );
    console.log(`\n💳 Paiements: ${paiements[0].count}`);

    // Compter les templates
    const [templates] = await connection.execute(
      'SELECT COUNT(*) as count FROM templates WHERE user_id = ?',
      [USER_ID]
    );
    console.log(`📝 Templates: ${templates[0].count}`);

    // Compter les produits
    const [produits] = await connection.execute(
      'SELECT COUNT(*) as count FROM produits WHERE user_id = ?',
      [USER_ID]
    );
    console.log(`📦 Produits: ${produits[0].count}`);

    console.log('\n✅ Vérification terminée');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

checkDatabase();
