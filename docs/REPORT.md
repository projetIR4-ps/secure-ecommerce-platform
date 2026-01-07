# Projet – Plateforme E-commerce Sécurisée

## 1. Présentation du projet
Ce projet consiste à développer une plateforme e-commerce sécurisée.
Les utilisateurs peuvent proposer et acheter des produits.
L’objectif principal est l’application des principes de sécurité tout au long du cycle de développement (SDLC sécurisé).

## 2. Exigences fonctionnelles
- Inscription et connexion des utilisateurs
- Gestion de plusieurs rôles
- Consultation des produits
- Passage de commandes
- Administration basique de la plateforme

## 3. Rôles utilisateurs
- Client : consulte les produits et passe des commandes
- Vendeur : crée des produits et gère les commandes
- Administrateur : gère les utilisateurs et les produits

## 4. Architecture du système
La plateforme est composée d’un frontend web, d’un backend exposant une API sécurisée et d’une base de données.
Les échanges sont protégés et l’accès aux fonctionnalités dépend du rôle de l’utilisateur.
Dans le cadre de ce projet académique, les données sont stockées temporairement en mémoire.
Ce choix permet de se concentrer sur la sécurité applicative et la démonstration des contrôles de sécurité.
Les mécanismes de sécurité resteraient identiques avec une base de données relationnelle persistante.

## 5. SDLC sécurisé
La sécurité a été intégrée dès la phase de conception.
Une analyse des menaces a été réalisée avec le modèle STRIDE.
Des contrôles de sécurité ont été implémentés puis testés et validés par démonstration.

## 6. Analyse des menaces (STRIDE)
Une menace a été identifiée et traitée pour chaque catégorie du modèle STRIDE.
Des mesures de sécurité adaptées ont été mises en place pour limiter les risques.

## 7. Mesures de sécurité mises en œuvre
- Hash des mots de passe
- Contrôle d’accès basé sur les rôles
- Validation des entrées utilisateur
- Protection contre les accès non autorisés
- Gestion sécurisée des secrets

## 8. Technologies utilisées
- Backend : API sécurisée
- Frontend : application web
- Stockage des données en mémoire (simulation de base de données relationnelle)

- Outils : GitHub, Postman
