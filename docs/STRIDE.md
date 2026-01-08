# Analyse des menaces – Modèle STRIDE
Projet : Secure E-commerce Platform

## S — Spoofing (Usurpation d’identité)
Menace : Un attaquant tente de se connecter à un compte existant par attaque par force brute.
Impact : Accès non autorisé à un compte utilisateur.
Mesures de sécurité : Mots de passe hashés et limitation du nombre de tentatives de connexion.
Preuve (vidéo) : Envoi répété de requêtes de connexion avec un mot de passe incorrect entraînant une réponse HTTP 429 (Too Many Attempts).

## T — Tampering (Altération des données)
Menace : Un vendeur tente de modifier une commande qui ne concerne pas ses produits.
Impact : Modification frauduleuse de données.
Mesures de sécurité : Vérification de la propriété des ressources côté serveur avant toute modification.
Preuve (vidéo) : Tentative de modification d’une commande par un vendeur non propriétaire retournant une réponse HTTP 403 (Forbidden).

## R — Repudiation (Non-répudiation)
Menace : Un utilisateur nie avoir effectué une action (commande ou modification).
Impact : Difficulté à identifier l’auteur d’une action.
Mesures de sécurité : Association des actions à l’utilisateur authentifié via son token JWT.
Preuve (vidéo) : Les requêtes authentifiées incluent l’identifiant utilisateur permettant de tracer l’origine des actions.

## I — Information Disclosure (Divulgation d’informations)
Menace : Un utilisateur accède à des données auxquelles il n’est pas autorisé.
Impact : Fuite d’informations sensibles.
Mesures de sécurité : Contrôle d’accès basé sur les rôles et suppression des données sensibles dans les réponses API.
Preuve (vidéo) : Tentative d’accès à la route /admin/users par un client retournant une réponse HTTP 403 (Forbidden).

## D — Denial of Service (Déni de service)
Menace : Saturation de l’API par un grand nombre de requêtes.
Impact : Indisponibilité temporaire du service.
Mesures de sécurité : Limitation du nombre de requêtes sur les routes sensibles.
Preuve (vidéo) : Multiples requêtes de connexion entraînant un blocage automatique avec le code HTTP 429.

## E — Elevation of Privilege (Élévation de privilèges)
Menace : Un utilisateur tente d’obtenir des droits administrateur.
Impact : Accès complet et non autorisé à la plateforme.
Mesures de sécurité : Gestion stricte des rôles côté serveur et interdiction de leur modification par le client.
Preuve (vidéo) : Tentative d’accès à une route administrateur par un utilisateur non admin retournant une réponse HTTP 403 (Forbidden).
