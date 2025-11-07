-- =====================================
-- Script de création de la base de données
-- Kame Daay - MySQL Backend
-- =====================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS kame_daay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE kame_daay;

-- =====================================
-- Table des utilisateurs
-- =====================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_telephone (telephone)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================
-- Table des clients
-- =====================================
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(100),
    adresse TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_nom (nom),
    INDEX idx_telephone (telephone)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================
-- Table des ventes
-- =====================================
CREATE TABLE IF NOT EXISTS ventes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    montant_paye DECIMAL(10, 2) DEFAULT 0,
    type_paiement VARCHAR(20) NOT NULL,
    produits JSON,
    date_vente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_client_id (client_id),
    INDEX idx_date_vente (date_vente),
    INDEX idx_type_paiement (type_paiement)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================
-- Table des paiements
-- =====================================
CREATE TABLE IF NOT EXISTS paiements (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    vente_id VARCHAR(36) NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (vente_id) REFERENCES ventes (id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_vente_id (vente_id),
    INDEX idx_date_paiement (date_paiement)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================
-- Table des produits
-- =====================================
CREATE TABLE IF NOT EXISTS produits (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_nom (nom)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================
-- Table des templates WhatsApp
-- =====================================
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    contenu TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================
-- Table des objectifs
-- =====================================
CREATE TABLE IF NOT EXISTS objectifs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    periode VARCHAR(20) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_periode (periode)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================
-- Table des dépenses
-- =====================================
CREATE TABLE IF NOT EXISTS depenses (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    categorie VARCHAR(50) NOT NULL,
    description TEXT,
    date_depense TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_date_depense (date_depense),
    INDEX idx_categorie (categorie)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================
-- Table des rappels
-- =====================================
CREATE TABLE IF NOT EXISTS rappels (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36),
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_rappel TIMESTAMP NOT NULL,
    resolu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_client_id (client_id),
    INDEX idx_date_rappel (date_rappel),
    INDEX idx_resolu (resolu)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================
-- Vérification
-- =====================================
SELECT 'Base de données créée avec succès !' AS message;

SHOW TABLES;

-- =====================================
-- Statistiques
-- =====================================
SELECT 'Tables créées' AS Info, COUNT(*) AS Nombre
FROM information_schema.tables
WHERE
    table_schema = 'kame_daay';