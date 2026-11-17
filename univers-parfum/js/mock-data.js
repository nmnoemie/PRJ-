/**
 * mock-data.js
 * Données fictives pour le mode démonstration (USE_MOCK = true).
 * Aucune marque réelle : toutes les marques et tous les parfums sont inventés.
 * Ce fichier expose window.MOCK_DATA qui sera copié dans localStorage
 * par api.js lors de l'initialisation / réinitialisation de la démo.
 */
(function () {
  "use strict";

  // Mot de passe de tous les comptes de démo : Test1234!
  const PASSWORD = "Test1234!";

  // Date de référence pour rendre les données cohérentes (démo)
  // Format ISO ; l'affichage sera converti en jj/mm/aaaa.
  const D = (s) => new Date(s).toISOString();

  /* ------------------------------------------------------------------ */
  /*  PARFUMS (12)                                                       */
  /* ------------------------------------------------------------------ */
  const parfums = [
    {
      reference: "PAR-001",
      nom: "Nuit Ambrée",
      marque: "Maison Lumen",
      contenance_ml: 100,
      prix: 129.9,
      stock_disponible: 12,
      description: "Un oriental ambré, boisé et enveloppant, pour les soirées d'hiver.",
      notes: "Ambre, santal, vanille bourbon",
      famille: "Oriental",
      degrade: "linear-gradient(135deg,#3b2416,#a8763e)",
    },
    {
      reference: "PAR-002",
      nom: "Jardin de Sel",
      marque: "Maison Lumen",
      contenance_ml: 50,
      prix: 89.9,
      stock_disponible: 7,
      description: "Une fraîcheur saline et marine, évoquant les embruns au lever du jour.",
      notes: "Sel marin, bergamote, cèdre blanc",
      famille: "Aromatique",
      degrade: "linear-gradient(135deg,#2b5b6b,#a8d0d6)",
    },
    {
      reference: "PAR-003",
      nom: "Cuir de Minuit",
      marque: "Atelier Noirceur",
      contenance_ml: 100,
      prix: 149.0,
      stock_disponible: 0,
      description: "Un cuir fumé, intense et racé, signature d'une élégance nocturne.",
      notes: "Cuir, tabac blond, poivre noir",
      famille: "Cuiré",
      degrade: "linear-gradient(135deg,#1a1110,#5a2a1a)",
    },
    {
      reference: "PAR-004",
      nom: "Pivoine Céleste",
      marque: "Atelier Noirceur",
      contenance_ml: 30,
      prix: 59.9,
      stock_disponible: 3,
      description: "Un floral poudré, délicat et lumineux, tout en transparence.",
      notes: "Pivoine, musc blanc, poire",
      famille: "Floral",
      degrade: "linear-gradient(135deg,#c76a7a,#f3c7cf)",
    },
    {
      reference: "PAR-005",
      nom: "Vétiver d'Orient",
      marque: "Sillage Rare",
      contenance_ml: 50,
      prix: 99.9,
      stock_disponible: 15,
      description: "Un boisé terreux et vibrant, porté par un vétiver fumé.",
      notes: "Vétiver, cèdre, encens",
      famille: "Boisé",
      degrade: "linear-gradient(135deg,#2f3d24,#8aa06a)",
    },
    {
      reference: "PAR-006",
      nom: "Sucre de Lune",
      marque: "Sillage Rare",
      contenance_ml: 100,
      prix: 119.9,
      stock_disponible: 2, // stock bas
      description: "Une gourmandise nocturne, caramel et fleur d'oranger.",
      notes: "Caramel, fleur d'oranger, tonka",
      famille: "Gourmand",
      degrade: "linear-gradient(135deg,#6b4a1a,#f0c987)",
    },
    {
      reference: "PAR-007",
      nom: "Brume d'Été",
      marque: "Maison Lumen",
      contenance_ml: 30,
      prix: 49.9,
      stock_disponible: 20,
      description: "Un hespéridé pétillant, citron vert et menthe fraîche.",
      notes: "Citron vert, menthe, gingembre",
      famille: "Hespéridé",
      degrade: "linear-gradient(135deg,#8aa832,#e6f0a8)",
    },
    {
      reference: "PAR-008",
      nom: "Oud Impérial",
      marque: "Atelier Noirceur",
      contenance_ml: 50,
      prix: 139.0,
      stock_disponible: 5,
      description: "Un oud précieux, profond, souligné de rose de Damas.",
      notes: "Oud, rose, safran",
      famille: "Oriental boisé",
      degrade: "linear-gradient(135deg,#3a0f1c,#8a3a4a)",
    },
    {
      reference: "PAR-009",
      nom: "Linge Blanc",
      marque: "Sillage Rare",
      contenance_ml: 100,
      prix: 79.9,
      stock_disponible: 0,
      description: "Un musc propre et cotonneux, comme un linge séché au soleil.",
      notes: "Musc, coton, aldéhydes",
      famille: "Musqué",
      degrade: "linear-gradient(135deg,#b8bcc4,#f4f6f8)",
    },
    {
      reference: "PAR-010",
      nom: "Figuier Sacré",
      marque: "Maison Lumen",
      contenance_ml: 50,
      prix: 69.9,
      stock_disponible: 18,
      description: "Une figue verte et laiteuse, ombragée de bois clair.",
      notes: "Feuille de figuier, lait, bois blanc",
      famille: "Vert",
      degrade: "linear-gradient(135deg,#3f5a2a,#c7d6a0)",
    },
    {
      reference: "PAR-011",
      nom: "Poivre & Rose",
      marque: "Atelier Noirceur",
      contenance_ml: 30,
      prix: 39.9,
      stock_disponible: 2, // stock bas
      description: "Un choc poivré et floral, épicé et moderne.",
      notes: "Poivre rose, rose, patchouli",
      famille: "Épicé floral",
      degrade: "linear-gradient(135deg,#7a2a3a,#e0a0b0)",
    },
    {
      reference: "PAR-012",
      nom: "Bois de Lune",
      marque: "Sillage Rare",
      contenance_ml: 100,
      prix: 109.9,
      stock_disponible: 9,
      description: "Un boisé lacté et crémeux, doux comme un clair de lune.",
      notes: "Bois de santal, iris, musc",
      famille: "Boisé musqué",
      degrade: "linear-gradient(135deg,#2a2f3a,#b8c0d0)",
    },
  ];

  /* ------------------------------------------------------------------ */
  /*  UTILISATEURS                                                       */
  /* ------------------------------------------------------------------ */
  // Champs communs : id, nom, prenom, email, password, telephone, adresse, role, actif
  const users = [
    {
      id: "U-ADMIN",
      nom: "Dupont",
      prenom: "Alice",
      email: "admin@parfum.test",
      password: PASSWORD,
      telephone: "01 23 45 67 89",
      adresse: "12 rue des Lilas, 75011 Paris",
      role: "ADMIN",
      actif: true,
    },
    {
      id: "U-PREPA",
      nom: "Martin",
      prenom: "Bruno",
      email: "prepa@parfum.test",
      password: PASSWORD,
      telephone: "01 23 45 67 90",
      adresse: "5 avenue de l'Atelier, 69003 Lyon",
      role: "PREPARATEUR",
      actif: true,
    },
    {
      id: "U-LIVREUR",
      nom: "Petit",
      prenom: "Carla",
      email: "livreur@parfum.test",
      password: PASSWORD,
      telephone: "06 11 22 33 44",
      adresse: "8 rue du Courrier, 33000 Bordeaux",
      role: "LIVREUR",
      actif: true,
    },
    {
      id: "U-CLIENT",
      nom: "Durand",
      prenom: "David",
      email: "client@parfum.test",
      password: PASSWORD,
      telephone: "06 55 66 77 88",
      adresse: "24 rue des Parfums, 75004 Paris",
      role: "CLIENT",
      actif: true,
    },
    {
      id: "U-CLIENT2",
      nom: "Leroy",
      prenom: "Emma",
      email: "emma@parfum.test",
      password: PASSWORD,
      telephone: "06 12 34 56 78",
      adresse: "3 place des Roses, 44000 Nantes",
      role: "CLIENT",
      actif: true,
    },
    {
      id: "U-CLIENT3",
      nom: "Moreau",
      prenom: "Farid",
      email: "farid@parfum.test",
      password: PASSWORD,
      telephone: "07 22 33 44 55",
      adresse: "17 boulevard du Midi, 13006 Marseille",
      role: "CLIENT",
      actif: true,
    },
    {
      id: "U-CLIENT4",
      nom: "Garnier",
      prenom: "Sophie",
      email: "sophie@parfum.test",
      password: PASSWORD,
      telephone: "06 98 76 54 32",
      adresse: "9 rue du Verger, 31000 Toulouse",
      role: "CLIENT",
      actif: true,
    },
    {
      id: "U-CLIENT5",
      nom: "Roux",
      prenom: "Thomas",
      email: "thomas@parfum.test",
      password: PASSWORD,
      telephone: "07 44 55 66 77",
      adresse: "45 rue Haute, 59000 Lille",
      role: "CLIENT",
      actif: true,
    },
  ];

  /* ------------------------------------------------------------------ */
  /*  PROMOTIONS (3)                                                     */
  /* ------------------------------------------------------------------ */
  const promotions = [
    {
      id: "PROMO-1",
      code: "BIENVENUE10",
      pourcentage: 10,
      debut: D("2025-01-01"),
      fin: D("2026-12-31"),
      actif: true,
    },
    {
      id: "PROMO-2",
      code: "FETE20",
      pourcentage: 20,
      debut: D("2025-06-01"),
      fin: D("2026-01-15"),
      actif: true,
    },
    {
      id: "PROMO-3",
      code: "VIP15",
      pourcentage: 15,
      debut: D("2025-03-01"),
      fin: D("2026-06-30"),
      actif: false,
    },
  ];

  /* ------------------------------------------------------------------ */
  /*  ZONES DE LIVRAISON (4)                                             */
  /* ------------------------------------------------------------------ */
  const zones = [
    { id: "Z-1", nom: "Paris intra-muros", frais: 4.9, actif: true },
    { id: "Z-2", nom: "Île-de-France", frais: 7.9, actif: true },
    { id: "Z-3", nom: "Province", frais: 9.9, actif: true },
    { id: "Z-4", nom: "Corse & DOM-TOM", frais: 19.9, actif: false },
  ];

  /* ------------------------------------------------------------------ */
  /*  COMMANDES (10) réparties sur tous les statuts                     */
  /*  Cycle : EN_ATTENTE_PAIEMENT → PAYEE → EN_PREPARATION → PRETE       */
  /*          → EN_LIVRAISON → LIVREE ; ANNULEE                         */
  /* ------------------------------------------------------------------ */

  // Helper pour construire une ligne de commande à partir d'un parfum
  const ligne = (ref, qte, dispo = true) => {
    const p = parfums.find((x) => x.reference === ref);
    return {
      id: "L-" + ref + "-" + Math.random().toString(36).slice(2, 8),
      reference: ref,
      nom: p.nom,
      marque: p.marque,
      prix_unitaire: p.prix,
      quantite: qte,
      disponible: dispo,
    };
  };

  // Helper pour construire une entrée d'historique
  const hist = (ancien, nouveau, date, auteur) => ({
    ancien_statut: ancien,
    nouveau_statut: nouveau,
    date: D(date),
    auteur: auteur,
  });

  // Helper pour construire un incident
  const incident = (type, motif, date, auteur) => ({
    id: "INC-" + Math.random().toString(36).slice(2, 8),
    type: type, // "RUPTURE" | "LIVRAISON" | "LITIGE"
    motif: motif,
    date: D(date),
    auteur: auteur,
  });

  const commandes = [
    /* 1) EN_ATTENTE_PAIEMENT : panier actif du client principal */
    {
      id: "CMD-001",
      client_id: "U-CLIENT",
      statut: "EN_ATTENTE_PAIEMENT",
      date_creation: D("2025-11-20T10:00:00"),
      lignes: [ligne("PAR-002", 1), ligne("PAR-004", 1)],
      total: 89.9 + 59.9,
      zone_id: "Z-1",
      adresse_livraison: "24 rue des Parfums, 75004 Paris",
      telephone: "06 55 66 77 88",
      tentatives_livraison: 0,
      historique: [hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-20T10:00:00", "Système")],
      paiement: null,
      incidents: [],
    },

    /* 2) PAYEE : commande à préparer (client Emma) */
    {
      id: "CMD-002",
      client_id: "U-CLIENT2",
      statut: "PAYEE",
      date_creation: D("2025-11-21T14:30:00"),
      lignes: [ligne("PAR-001", 1)],
      total: 129.9,
      zone_id: "Z-2",
      adresse_livraison: "3 place des Roses, 44000 Nantes",
      telephone: "06 12 34 56 78",
      tentatives_livraison: 0,
      historique: [
        hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-21T14:30:00", "Système"),
        hist("EN_ATTENTE_PAIEMENT", "PAYEE", "2025-11-21T14:35:00", "Client"),
      ],
      paiement: {
        montant: 129.9,
        date: D("2025-11-21T14:35:00"),
        mode: "CARTE_SIMULEE",
      },
      incidents: [],
    },

    /* 3) EN_PREPARATION : prise en charge par le préparateur */
    {
      id: "CMD-003",
      client_id: "U-CLIENT3",
      statut: "EN_PREPARATION",
      date_creation: D("2025-11-21T09:15:00"),
      lignes: [ligne("PAR-005", 2), ligne("PAR-010", 1)],
      total: 99.9 * 2 + 69.9,
      zone_id: "Z-3",
      adresse_livraison: "17 boulevard du Midi, 13006 Marseille",
      telephone: "07 22 33 44 55",
      tentatives_livraison: 0,
      historique: [
        hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-21T09:15:00", "Système"),
        hist("EN_ATTENTE_PAIEMENT", "PAYEE", "2025-11-21T09:20:00", "Client"),
        hist("PAYEE", "EN_PREPARATION", "2025-11-21T11:00:00", "Bruno Martin"),
      ],
      paiement: {
        montant: 99.9 * 2 + 69.9,
        date: D("2025-11-21T09:20:00"),
        mode: "CARTE_SIMULEE",
      },
      incidents: [],
    },

    /* 4) EN_PREPARATION avec une ligne indisponible + incident */
    {
      id: "CMD-004",
      client_id: "U-CLIENT4",
      statut: "EN_PREPARATION",
      date_creation: D("2025-11-20T16:45:00"),
      lignes: [ligne("PAR-003", 1, false), ligne("PAR-007", 1)],
      total: 149.0 + 49.9,
      zone_id: "Z-1",
      adresse_livraison: "9 rue du Verger, 31000 Toulouse",
      telephone: "06 98 76 54 32",
      tentatives_livraison: 0,
      historique: [
        hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-20T16:45:00", "Système"),
        hist("EN_ATTENTE_PAIEMENT", "PAYEE", "2025-11-20T16:50:00", "Client"),
        hist("PAYEE", "EN_PREPARATION", "2025-11-21T08:30:00", "Bruno Martin"),
      ],
      paiement: {
        montant: 149.0 + 49.9,
        date: D("2025-11-20T16:50:00"),
        mode: "CARTE_SIMULEE",
      },
      incidents: [
        incident(
          "RUPTURE",
          "Cuir de Minuit (PAR-003) en rupture de stock : ligne signalée indisponible.",
          "2025-11-21T09:00:00",
          "Bruno Martin"
        ),
      ],
    },

    /* 5) PRETE : disponible pour un livreur */
    {
      id: "CMD-005",
      client_id: "U-CLIENT5",
      statut: "PRETE",
      date_creation: D("2025-11-19T11:00:00"),
      lignes: [ligne("PAR-012", 1)],
      total: 109.9,
      zone_id: "Z-2",
      adresse_livraison: "45 rue Haute, 59000 Lille",
      telephone: "07 44 55 66 77",
      tentatives_livraison: 0,
      historique: [
        hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-19T11:00:00", "Système"),
        hist("EN_ATTENTE_PAIEMENT", "PAYEE", "2025-11-19T11:05:00", "Client"),
        hist("PAYEE", "EN_PREPARATION", "2025-11-19T13:00:00", "Bruno Martin"),
        hist("EN_PREPARATION", "PRETE", "2025-11-19T17:30:00", "Bruno Martin"),
      ],
      paiement: {
        montant: 109.9,
        date: D("2025-11-19T11:05:00"),
        mode: "CARTE_SIMULEE",
      },
      incidents: [],
    },

    /* 6) PRETE : deuxième colis pour le livreur */
    {
      id: "CMD-006",
      client_id: "U-CLIENT2",
      statut: "PRETE",
      date_creation: D("2025-11-20T08:00:00"),
      lignes: [ligne("PAR-006", 1), ligne("PAR-011", 1)],
      total: 119.9 + 39.9,
      zone_id: "Z-1",
      adresse_livraison: "3 place des Roses, 44000 Nantes",
      telephone: "06 12 34 56 78",
      tentatives_livraison: 0,
      historique: [
        hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-20T08:00:00", "Système"),
        hist("EN_ATTENTE_PAIEMENT", "PAYEE", "2025-11-20T08:05:00", "Client"),
        hist("PAYEE", "EN_PREPARATION", "2025-11-20T10:00:00", "Bruno Martin"),
        hist("EN_PREPARATION", "PRETE", "2025-11-20T15:00:00", "Bruno Martin"),
      ],
      paiement: {
        montant: 119.9 + 39.9,
        date: D("2025-11-20T08:05:00"),
        mode: "CARTE_SIMULEE",
      },
      incidents: [],
    },

    /* 7) EN_LIVRAISON : livraison en cours, 2 tentatives échouées */
    {
      id: "CMD-007",
      client_id: "U-CLIENT3",
      statut: "EN_LIVRAISON",
      date_creation: D("2025-11-18T10:00:00"),
      lignes: [ligne("PAR-008", 1)],
      total: 139.0,
      zone_id: "Z-3",
      adresse_livraison: "17 boulevard du Midi, 13006 Marseille",
      telephone: "07 22 33 44 55",
      tentatives_livraison: 2,
      historique: [
        hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-18T10:00:00", "Système"),
        hist("EN_ATTENTE_PAIEMENT", "PAYEE", "2025-11-18T10:05:00", "Client"),
        hist("PAYEE", "EN_PREPARATION", "2025-11-18T14:00:00", "Bruno Martin"),
        hist("EN_PREPARATION", "PRETE", "2025-11-18T18:00:00", "Bruno Martin"),
        hist("PRETE", "EN_LIVRAISON", "2025-11-19T08:00:00", "Carla Petit"),
      ],
      paiement: {
        montant: 139.0,
        date: D("2025-11-18T10:05:00"),
        mode: "CARTE_SIMULEE",
      },
      incidents: [
        incident("LIVRAISON", "Tentative 1 : absence du destinataire.", "2025-11-19T10:00:00", "Carla Petit"),
        incident("LIVRAISON", "Tentative 2 : adresse inaccessible (portail fermé).", "2025-11-20T10:30:00", "Carla Petit"),
      ],
    },

    /* 8) LIVREE : commande livrée, avec paiement */
    {
      id: "CMD-008",
      client_id: "U-CLIENT",
      statut: "LIVREE",
      date_creation: D("2025-11-15T09:00:00"),
      lignes: [ligne("PAR-001", 1)],
      total: 129.9,
      zone_id: "Z-1",
      adresse_livraison: "24 rue des Parfums, 75004 Paris",
      telephone: "06 55 66 77 88",
      tentatives_livraison: 0,
      historique: [
        hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-15T09:00:00", "Système"),
        hist("EN_ATTENTE_PAIEMENT", "PAYEE", "2025-11-15T09:05:00", "Client"),
        hist("PAYEE", "EN_PREPARATION", "2025-11-15T11:00:00", "Bruno Martin"),
        hist("EN_PREPARATION", "PRETE", "2025-11-15T15:00:00", "Bruno Martin"),
        hist("PRETE", "EN_LIVRAISON", "2025-11-16T08:00:00", "Carla Petit"),
        hist("EN_LIVRAISON", "LIVREE", "2025-11-16T14:00:00", "Carla Petit"),
      ],
      paiement: {
        montant: 129.9,
        date: D("2025-11-15T09:05:00"),
        mode: "CARTE_SIMULEE",
      },
      incidents: [],
    },

    /* 9) ANNULEE : annulée suite à échec de livraison (3 tentatives) */
    {
      id: "CMD-009",
      client_id: "U-CLIENT4",
      statut: "ANNULEE",
      date_creation: D("2025-11-10T13:00:00"),
      lignes: [ligne("PAR-005", 1)],
      total: 99.9,
      zone_id: "Z-1",
      adresse_livraison: "9 rue du Verger, 31000 Toulouse",
      telephone: "06 98 76 54 32",
      tentatives_livraison: 3,
      historique: [
        hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-10T13:00:00", "Système"),
        hist("EN_ATTENTE_PAIEMENT", "PAYEE", "2025-11-10T13:05:00", "Client"),
        hist("PAYEE", "EN_PREPARATION", "2025-11-10T15:00:00", "Bruno Martin"),
        hist("EN_PREPARATION", "PRETE", "2025-11-10T18:00:00", "Bruno Martin"),
        hist("PRETE", "EN_LIVRAISON", "2025-11-11T08:00:00", "Carla Petit"),
        hist("EN_LIVRAISON", "ANNULEE", "2025-11-14T18:00:00", "Système"),
      ],
      paiement: {
        montant: 99.9,
        date: D("2025-11-10T13:05:00"),
        mode: "CARTE_SIMULEE",
      },
      incidents: [
        incident("LIVRAISON", "Tentative 1 : absence.", "2025-11-11T10:00:00", "Carla Petit"),
        incident("LIVRAISON", "Tentative 2 : absence.", "2025-11-12T10:00:00", "Carla Petit"),
        incident("LIVRAISON", "Tentative 3 : absence. Annulation automatique après 3 échecs.", "2025-11-14T18:00:00", "Système"),
      ],
    },

    /* 10) PAYEE : deuxième commande à préparer (client Sophie) */
    {
      id: "CMD-010",
      client_id: "U-CLIENT5",
      statut: "PAYEE",
      date_creation: D("2025-11-22T10:00:00"),
      lignes: [ligne("PAR-007", 2), ligne("PAR-010", 1)],
      total: 49.9 * 2 + 69.9,
      zone_id: "Z-2",
      adresse_livraison: "45 rue Haute, 59000 Lille",
      telephone: "07 44 55 66 77",
      tentatives_livraison: 0,
      historique: [
        hist(null, "EN_ATTENTE_PAIEMENT", "2025-11-22T10:00:00", "Système"),
        hist("EN_ATTENTE_PAIEMENT", "PAYEE", "2025-11-22T10:05:00", "Client"),
      ],
      paiement: {
        montant: 49.9 * 2 + 69.9,
        date: D("2025-11-22T10:05:00"),
        mode: "CARTE_SIMULEE",
      },
      incidents: [],
    },
  ];

  // Export global
  window.MOCK_DATA = {
    version: 1,
    parfums,
    users,
    promotions,
    zones,
    commandes,
  };
})();