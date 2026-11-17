USE Univers_parfums;
GO

ALTER TABLE utilisateur ADD actif BIT NOT NULL DEFAULT 1;
ALTER TABLE parfum ADD description NVARCHAR(500) NULL, actif BIT NOT NULL DEFAULT 1;
GO

CREATE TABLE zone_livraison (
    id    INT IDENTITY(1,1) PRIMARY KEY,
    nom   NVARCHAR(100) NOT NULL,
    frais DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (frais >= 0),
    actif BIT NOT NULL DEFAULT 1
);

CREATE TABLE promotion (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    code        NVARCHAR(50) NOT NULL UNIQUE,
    pourcentage DECIMAL(5,2) NOT NULL CHECK (pourcentage BETWEEN 0 AND 100),
    date_debut  DATE NOT NULL,
    date_fin    DATE NOT NULL,
    CHECK (date_fin >= date_debut)
);
GO