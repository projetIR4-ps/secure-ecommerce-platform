# Analyse des menaces – Modèle STRIDE
Projet : Secure E-commerce Platform

## S — Spoofing (Usurpation d’identité)
Menace : Un attaquant tente de se connecter à un compte existant par brute force.
Impact : Accès non autorisé à un compte utilisateur.
Mesures de sécurité : Hash des mots de passe et limitation du nombre de tentatives de connexion.
Preuve (vidéo) : Plusieurs tentatives de connexion entraînent un blocage.

## T — Tampering (Altération des données)
Menace : Un utilisateur modifie une commande ou un produit qui ne lui appartient pas.
Impact : Fraude et modification non autorisée des données.
Mesures de sécurité : Contrôle d’accès par rôle et vérification que l’utilisateur est propriétaire des données.
Preuve (vidéo) : Tentative de modification refusée par le serveur.

## R — Repudiation (Non-répudiation)
Menace : Un utilisateur nie avoir effectué une action (commande, modification).
Impact : Impossible de prouver les actions réalisées.
Mesures de sécurité : Journalisation des actions importantes avec l’identifiant utilisateur et la date.
Preuve (vidéo) : Affichage d’un log lors d’une action.

## I — Information Disclosure (Divulgation d’informations)
Menace : Accès aux données d’autres utilisateurs ou fuite d’informations sensibles.
Impact : Violation de la confidentialité.
Mesures de sécurité : Contrôle d’accès strict et filtrage des données sensibles.
Preuve (vidéo) : Accès non autorisé refusé.

## D — Denial of Service (Déni de service)
Menace : Envoi massif de requêtes vers l’API.
Impact : Indisponibilité de la plateforme.
Mesures de sécurité : Limitation du nombre de requêtes par utilisateur.
Preuve (vidéo) : Requêtes bloquées après dépassement du seuil.

## E — Elevation of Privilege (Élévation de privilèges)
Menace : Un utilisateur tente d’obtenir le rôle administrateur.
Impact : Compromission totale de la plateforme.
Mesures de sécurité : Les rôles sont définis uniquement côté serveur.
Preuve (vidéo) : Tentative échouée d’obtention du rôle admin.
ON CONTINUE
