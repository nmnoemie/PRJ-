# Projet application métier : Boutique de vente de parfums en ligne

## Contexte

Aujourd'hui, une petite boutique de parfums gère ses commandes avec des tableurs, des mails et des appels téléphoniques :

- les commandes se perdent entre plusieurs canaux
- personne ne sait qui prépare quelle commande ni où elle en est
- stocks erronés : parfums vendus alors qu'ils sont en rupture, ou doublons de préparation
- livraisons mal suivies, clients sans nouvelles de leur colis

Objectif : un site web de vente de parfums permettant de commander, préparer, livrer et suivre chaque commande de bout en bout.

## Rôles

- **Administrateur** : gère les comptes, le catalogue de parfums (références, prix, stocks), les promotions et les zones de livraison. Il modère les commandes en cas de litige.
- **Préparateur de commandes** : prend en charge les commandes payées, prépare et emballe les colis, met à jour le statut de préparation et signale les ruptures de stock.
- **Livreur** : récupère les colis prêts, effectue les livraisons, confirme la remise au client ou signale un échec de livraison.
- **Client** : consulte le catalogue, constitue son panier, passe commande, règle son achat et suit sa livraison.

## Règles de gestion

- Une commande appartient à un seul client et contient au moins un article.
- Un client ne peut commander un parfum que si le stock disponible est suffisant.
- Chaque commande est prise en charge par un seul préparateur, puis confirmée à un seul livreur.
- Une commande suit les statuts : « en attente de paiement », « payée », « en préparation », « prête », « en livraison », « livrée », « annulée ».
- Le client peut modifier ou annuler sa commande tant qu'elle n'est pas passée en préparation.
- Si le client annule après le début de la préparation, seul l'administrateur peut valider l'annulation, et les articles sont remis en stock.
- En cas de rupture constatée lors de la préparation, l'article passe en « indisponible », le client est prévenu et l'administrateur est alerté.
- Après trois tentatives de livraison échouées, la commande retourne à l'administrateur pour décision (nouvelle date, remboursement).
- Chaque changement de statut d'une commande est historisé (qui, quoi, quand).
- Seul l'administrateur peut modifier le catalogue ou supprimer un compte.

## Risques métiers

### Panne ou incident sur l'application

- Plus d'accès à la liste des commandes le jour de forte affluence → retards de préparation. Prévoir un export PDF des commandes à préparer et des tournées de livraison.
- Perte de données (commandes, stocks, comptes clients) → prévoir une sauvegarde régulière.
- Livreur sans réseau en tournée → la liste de ses livraisons doit rester consultable hors-ligne.

### Incident pendant la préparation ou la livraison

- Flacon cassé ou abîmé pendant l'emballage ou le transport → signalement avec motif, remplacement ou remboursement géré par l'administrateur.
- Colis perdu ou client absent → statut « échec de livraison » visible immédiatement et client notifié.
- Stock insuffisant pour une commande déjà payée → statut « indisponible » visible dès la détection, pour réagir rapidement.

### Mauvais usage des droits

- Un préparateur ou un livreur qui modifie une commande qui ne lui est pas attribuée → d'où l'historique et la limitation des droits à ses propres commandes.
- Données personnelles (adresse, téléphone du client) visibles par tous → visibles uniquement par le livreur concerné pendant la livraison, le préparateur n'ayant accès qu'au contenu de la commande.

## User stories

- En tant que **client**, je constitue mon panier et je passe commande pour recevoir mes parfums à l'adresse de mon choix.
- En tant que **client**, je suis l'avancement de ma commande en temps réel et je vois immédiatement si un article est indisponible.
- En tant que **client**, je ne peux plus annuler seul ma commande une fois sa préparation commencée.
- En tant que **préparateur**, je vois la liste des commandes payées à traiter pour les préparer sans doublon ni oubli.
- En tant que **livreur**, je consulte mes livraisons du jour et je confirme chaque remise pour que le client et la boutique soient informés.
- En tant qu'**administrateur**, je peux corriger ou annuler une commande, ou supprimer un compte, en cas d'abus ou de litige.

## Matrice de droits

| | Voir le catalogue | Gérer le catalogue et les stocks | Passer commande | Modifier / annuler sa commande | Voir les commandes | Préparer une commande | Livrer une commande | Mettre à jour le statut | Voir les coordonnées du client | Gérer les comptes |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin | x | x | | x (toutes, après préparation) | x (toutes) | | | x (toutes) | x | x |
| Préparateur | x | | | | x (celles à préparer) | x | | x (préparation) | | |
| Livreur | x | | | | x (ses livraisons) | | x | x (livraison) | x (ses livraisons) | |
| Client | x | | x | x (avant préparation) | x (ses commandes) | | | | | |