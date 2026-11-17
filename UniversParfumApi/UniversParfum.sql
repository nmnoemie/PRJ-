
    CREATE DATABASE Univers_parfums;
GO

USE Univers_parfums;
GO


CREATE TABLE utilisateur (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    nom           NVARCHAR(100) NOT NULL,
    prenom        NVARCHAR(100) NOT NULL,
    email         NVARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe  NVARCHAR(255) NOT NULL,
    telephone     NVARCHAR(20) NULL,
    role          NVARCHAR(20) NOT NULL
        CONSTRAINT ck_utilisateur_role
        CHECK (role IN ('ADMINISTRATEUR', 'PREPARATEUR', 'LIVREUR', 'CLIENT'))
);
GO

CREATE TABLE client (
    id                 INT PRIMARY KEY,
    adresse_livraison  NVARCHAR(255) NOT NULL,
    CONSTRAINT fk_client_utilisateur
        FOREIGN KEY (id) REFERENCES utilisateur(id) ON DELETE CASCADE
);
GO


CREATE TABLE parfum (
    reference          NVARCHAR(50) PRIMARY KEY,
    nom                NVARCHAR(150) NOT NULL,
    marque             NVARCHAR(100) NOT NULL,
    contenance_ml      INT NOT NULL CHECK (contenance_ml > 0),
    prix               DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
    stock_disponible   INT NOT NULL DEFAULT 0 CHECK (stock_disponible >= 0),
    administrateur_id  INT NULL,
    CONSTRAINT fk_parfum_admin
        FOREIGN KEY (administrateur_id) REFERENCES utilisateur(id) ON DELETE SET NULL
);
GO


CREATE TABLE commande (
    id                       INT IDENTITY(1,1) PRIMARY KEY,
    date_creation            DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    statut                   NVARCHAR(30) NOT NULL DEFAULT 'EN_ATTENTE_PAIEMENT'
        CONSTRAINT ck_commande_statut
        CHECK (statut IN ('EN_ATTENTE_PAIEMENT', 'PAYEE', 'EN_PREPARATION',
                          'PRETE', 'EN_LIVRAISON', 'LIVREE', 'ANNULEE')),
    montant_total            DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (montant_total >= 0),
    nb_tentatives_livraison  TINYINT NOT NULL DEFAULT 0
        CHECK (nb_tentatives_livraison BETWEEN 0 AND 3),
    client_id                INT NOT NULL,
    preparateur_id           INT NULL,
    livreur_id               INT NULL,
    CONSTRAINT fk_commande_client      FOREIGN KEY (client_id)      REFERENCES client(id),
    CONSTRAINT fk_commande_preparateur FOREIGN KEY (preparateur_id) REFERENCES utilisateur(id),
    CONSTRAINT fk_commande_livreur     FOREIGN KEY (livreur_id)     REFERENCES utilisateur(id)
);
GO

CREATE TABLE ligne_commande (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    commande_id    INT NOT NULL,
    parfum_ref     NVARCHAR(50) NOT NULL,
    quantite       INT NOT NULL CHECK (quantite > 0),
    prix_unitaire  DECIMAL(10,2) NOT NULL CHECK (prix_unitaire >= 0),
    indisponible   BIT NOT NULL DEFAULT 0,
    CONSTRAINT fk_ligne_commande FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE,
    CONSTRAINT fk_ligne_parfum   FOREIGN KEY (parfum_ref)  REFERENCES parfum(reference)
);
GO


CREATE TABLE paiement (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    commande_id    INT NOT NULL UNIQUE,
    montant        DECIMAL(10,2) NOT NULL CHECK (montant >= 0),
    date_paiement  DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    mode           NVARCHAR(50) NOT NULL,
    CONSTRAINT fk_paiement_commande FOREIGN KEY (commande_id) REFERENCES commande(id)
);
GO


CREATE TABLE historique_statut (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    commande_id     INT NOT NULL,
    ancien_statut   NVARCHAR(30) NULL
        CHECK (ancien_statut IN ('EN_ATTENTE_PAIEMENT', 'PAYEE', 'EN_PREPARATION',
                                 'PRETE', 'EN_LIVRAISON', 'LIVREE', 'ANNULEE')),
    nouveau_statut  NVARCHAR(30) NOT NULL
        CHECK (nouveau_statut IN ('EN_ATTENTE_PAIEMENT', 'PAYEE', 'EN_PREPARATION',
                                  'PRETE', 'EN_LIVRAISON', 'LIVREE', 'ANNULEE')),
    date_heure      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    auteur_id       INT NOT NULL,
    CONSTRAINT fk_histo_commande FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE,
    CONSTRAINT fk_histo_auteur   FOREIGN KEY (auteur_id)   REFERENCES utilisateur(id)
);
GO

CREATE TABLE tentative_livraison (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    commande_id  INT NOT NULL,
    livreur_id   INT NOT NULL,
    numero       TINYINT NOT NULL CHECK (numero BETWEEN 1 AND 3),
    date_heure   DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    reussie      BIT NOT NULL DEFAULT 0,
    motif_echec  NVARCHAR(255) NULL,
    CONSTRAINT uq_tentative UNIQUE (commande_id, numero),
    CONSTRAINT fk_tentative_commande FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE,
    CONSTRAINT fk_tentative_livreur  FOREIGN KEY (livreur_id)  REFERENCES utilisateur(id)
);
GO


CREATE TABLE incident (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    commande_id  INT NOT NULL,
    type         NVARCHAR(50) NOT NULL,
    motif        NVARCHAR(255) NOT NULL,
    date_heure   DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_incident_commande FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE
);
GO


CREATE INDEX idx_commande_client ON commande(client_id);
CREATE INDEX idx_commande_statut ON commande(statut);
CREATE INDEX idx_ligne_commande  ON ligne_commande(commande_id);
GO
