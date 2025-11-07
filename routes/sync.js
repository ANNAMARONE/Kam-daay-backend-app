const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Synchroniser toutes les données vers le serveur
router.post('/all', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      clients = [],
      ventes = [],
      paiements = [],
      produits = [],
      templates = [],
      objectifs = [],
      depenses = [],
      rappels = []
    } = req.body;

    const userId = req.userId;

    // Synchroniser les clients
    console.log(`📊 Synchronisation de ${clients.length} clients...`);
    for (const client of clients) {
      console.log(`  ➡️ Client: ${client.id} - ${client.nom} ${client.prenom} (${client.telephone})`);
      try {
        const result = await connection.query(
          `INSERT INTO clients (id, user_id, nom, prenom, telephone, email, adresse, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           nom = VALUES(nom), prenom = VALUES(prenom), telephone = VALUES(telephone),
           email = VALUES(email), adresse = VALUES(adresse), notes = VALUES(notes)`,
          [client.id, userId, client.nom, client.prenom, client.telephone, client.email, client.adresse, client.notes]
        );
        // result[0] contient OkPacket avec affectedRows
        if (result[0].affectedRows === 1) {
          console.log(`     ✅ Nouveau client inséré`);
        } else if (result[0].affectedRows === 2) {
          console.log(`     🔄 Client existant mis à jour`);
        }
      } catch (error) {
        console.error(`     ❌ Erreur insertion client ${client.id}:`, error.message);
        throw error;
      }
    }
    console.log(`✅ ${clients.length} clients synchronisés`);

    // Synchroniser les ventes
    console.log(`📊 Synchronisation de ${ventes.length} ventes...`);
    for (const vente of ventes) {
      console.log(`  ➡️ Vente: ${vente.id} - Montant: ${vente.montant}`);
      await connection.query(
        `INSERT INTO ventes (id, user_id, client_id, montant, montant_paye, type_paiement, produits, notes, date_vente)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         montant = VALUES(montant), montant_paye = VALUES(montant_paye),
         type_paiement = VALUES(type_paiement), produits = VALUES(produits), notes = VALUES(notes)`,
        [vente.id, userId, vente.clientId, vente.montant, vente.montantPaye, vente.typePaiement, 
         JSON.stringify(vente.produits), vente.notes, vente.dateVente]
      );
    }
    console.log(`✅ ${ventes.length} ventes synchronisées`);

    // Synchroniser les paiements
    console.log(`📊 Synchronisation de ${paiements.length} paiements...`);
    for (const paiement of paiements) {
      await connection.query(
        `INSERT INTO paiements (id, user_id, vente_id, montant, notes, date_paiement)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         montant = VALUES(montant), notes = VALUES(notes)`,
        [paiement.id, userId, paiement.venteId, paiement.montant, paiement.notes, paiement.datePaiement]
      );
    }
    console.log(`✅ ${paiements.length} paiements synchronisés`);

    // Synchroniser les produits
    console.log(`📊 Synchronisation de ${produits.length} produits...`);
    for (const produit of produits) {
      await connection.query(
        `INSERT INTO produits (id, user_id, nom, prix, description)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         nom = VALUES(nom), prix = VALUES(prix), description = VALUES(description)`,
        [produit.id, userId, produit.nom, produit.prix, produit.description]
      );
    }
    console.log(`✅ ${produits.length} produits synchronisés`);

    // Synchroniser les templates
    console.log(`📊 Synchronisation de ${templates.length} templates...`);
    for (const template of templates) {
      await connection.query(
        `INSERT INTO templates (id, user_id, nom, contenu)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         nom = VALUES(nom), contenu = VALUES(contenu)`,
        [template.id, userId, template.nom, template.contenu]
      );
    }
    console.log(`✅ ${templates.length} templates synchronisés`);

    // Synchroniser les objectifs
    console.log(`📊 Synchronisation de ${objectifs.length} objectifs...`);
    for (const objectif of objectifs) {
      await connection.query(
        `INSERT INTO objectifs (id, user_id, montant, periode, date_debut, date_fin)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         montant = VALUES(montant), periode = VALUES(periode)`,
        [objectif.id, userId, objectif.montant, objectif.periode, objectif.dateDebut, objectif.dateFin]
      );
    }
    console.log(`✅ ${objectifs.length} objectifs synchronisés`);

    // Synchroniser les dépenses
    console.log(`📊 Synchronisation de ${depenses.length} dépenses...`);
    for (const depense of depenses) {
      await connection.query(
        `INSERT INTO depenses (id, user_id, montant, categorie, description, date_depense)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         montant = VALUES(montant), categorie = VALUES(categorie)`,
        [depense.id, userId, depense.montant, depense.categorie, depense.description, depense.dateDepense]
      );
    }
    console.log(`✅ ${depenses.length} dépenses synchronisées`);

    // Synchroniser les rappels
    console.log(`📊 Synchronisation de ${rappels.length} rappels...`);
    for (const rappel of rappels) {
      await connection.query(
        `INSERT INTO rappels (id, user_id, client_id, titre, description, date_rappel, resolu)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         titre = VALUES(titre), description = VALUES(description), resolu = VALUES(resolu)`,
        [rappel.id, userId, rappel.clientId, rappel.titre, rappel.description, rappel.dateRappel, rappel.resolu]
      );
    }
    console.log(`✅ ${rappels.length} rappels synchronisés`);

    await connection.commit();

    console.log(`✅ Synchronisation réussie pour l'utilisateur ${userId}`);

    res.json({
      message: 'Synchronisation réussie',
      synced: {
        clients: clients.length,
        ventes: ventes.length,
        paiements: paiements.length,
        produits: produits.length,
        templates: templates.length,
        objectifs: objectifs.length,
        depenses: depenses.length,
        rappels: rappels.length
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Sync error:', error);
    res.status(500).json({ error: 'Erreur lors de la synchronisation' });
  } finally {
    connection.release();
  }
});

// Récupérer toutes les données du serveur
router.get('/all', async (req, res) => {
  try {
    const userId = req.userId;
    console.log(`📥 Récupération des données pour l'utilisateur ${userId}...`);

    const [clients] = await db.query('SELECT * FROM clients WHERE user_id = ?', [userId]);
    const [ventes] = await db.query('SELECT * FROM ventes WHERE user_id = ?', [userId]);
    const [paiements] = await db.query('SELECT * FROM paiements WHERE user_id = ?', [userId]);
    const [produits] = await db.query('SELECT * FROM produits WHERE user_id = ?', [userId]);
    const [templates] = await db.query('SELECT * FROM templates WHERE user_id = ?', [userId]);
    const [objectifs] = await db.query('SELECT * FROM objectifs WHERE user_id = ?', [userId]);
    const [depenses] = await db.query('SELECT * FROM depenses WHERE user_id = ?', [userId]);
    const [rappels] = await db.query('SELECT * FROM rappels WHERE user_id = ?', [userId]);

    console.log(`✅ Données récupérées:`, {
      clients: clients.length,
      ventes: ventes.length,
      paiements: paiements.length,
      produits: produits.length,
      templates: templates.length,
      objectifs: objectifs.length,
      depenses: depenses.length,
      rappels: rappels.length
    });

    res.json({
      clients,
      ventes: ventes.map(v => ({ ...v, produits: JSON.parse(v.produits || '[]') })),
      paiements,
      produits,
      templates,
      objectifs,
      depenses,
      rappels
    });
  } catch (error) {
    console.error('❌ Fetch error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

module.exports = router;
