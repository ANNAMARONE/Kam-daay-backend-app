const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const router = express.Router();

// Inscription
router.post('/signup', async (req, res) => {
  try {
    const { telephone, pin, nom, prenom } = req.body;

    // Validation
    if (!telephone || !pin || !nom || !prenom) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      return res.status(400).json({ error: 'Le PIN doit contenir exactement 4 chiffres' });
    }

    // Vérifier si le téléphone existe déjà
    const [existing] = await db.query(
      'SELECT id FROM users WHERE telephone = ?',
      [telephone]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ce numéro de téléphone est déjà utilisé' });
    }

    // Hasher le PIN
    const pinHash = await bcrypt.hash(pin, 10);

    // Créer l'utilisateur
    const userId = uuidv4();
    await db.query(
      'INSERT INTO users (id, telephone, pin_hash, nom, prenom) VALUES (?, ?, ?, ?, ?)',
      [userId, telephone, pinHash, nom, prenom]
    );

    console.log(`✅ Nouveau compte créé: ${prenom} ${nom} (${telephone})`);

    res.status(201).json({
      message: 'Compte créé avec succès',
      userId
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { telephone, pin } = req.body;

    // Validation
    if (!telephone || !pin) {
      return res.status(400).json({ error: 'Téléphone et PIN requis' });
    }

    // Trouver l'utilisateur
    const [users] = await db.query(
      'SELECT id, telephone, pin_hash, nom, prenom FROM users WHERE telephone = ?',
      [telephone]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Téléphone ou PIN incorrect' });
    }

    const user = users[0];

    // Vérifier le PIN
    const pinValid = await bcrypt.compare(pin, user.pin_hash);
    if (!pinValid) {
      return res.status(401).json({ error: 'Téléphone ou PIN incorrect' });
    }

    // Générer le token JWT
    const jwtSecret = process.env.JWT_SECRET || 'kame_daay_default_secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN?.trim() || '7d';
    
    const token = jwt.sign(
      { userId: user.id },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    console.log(`✅ Connexion réussie: ${user.prenom} ${user.nom}`);

    res.json({
      message: 'Connexion réussie',
      session: { access_token: token },
      user: {
        id: user.id,
        telephone: user.telephone,
        nom: user.nom,
        prenom: user.prenom
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

module.exports = router;
