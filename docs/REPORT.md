# Secure E-commerce Platform

## 1. Présentation du projet
Ce projet consiste à développer une plateforme e-commerce sécurisée.
L’objectif principal est de concevoir une application web simple tout en mettant l’accent sur la sécurité applicative
et l’analyse des menaces à l’aide du modèle STRIDE.

## 2. Architecture générale
La plateforme est composée de :
- un **backend** (API REST en Node.js / Express)
- un **frontend web minimal** permettant d’illustrer l’utilisation de l’API
- une couche de sécurité centralisée côté serveur

Le frontend communique avec le backend via des requêtes HTTP (fetch).

## 3. Choix techniques
### Backend
- Node.js / Express
- Authentification par JWT
- Gestion des rôles : client, seller, admin
- Contrôle d’accès basé sur les rôles (RBAC)

### Frontend
- HTML / JavaScript simple
- Interface minimale servant à démontrer le fonctionnement de la plateforme

### Stockage des données
Les données sont stockées **temporairement en mémoire**.
Ce choix pédagogique permet de se concentrer sur les mécanismes de sécurité.
Les contrôles de sécurité resteraient identiques avec une base de données persistante.

## 4. Sécurité et modèle STRIDE
La sécurité de la plateforme a été analysée et implémentée selon le modèle STRIDE.
Les principales menaces ont été identifiées et des contre-mesures ont été mises en place
(authentification, contrôle d’accès, limitation des requêtes, vérification de propriété).

Les preuves de sécurité sont fournies via des captures d’écran et une vidéo de démonstration.

## 5. Démonstration
Une vidéo de démonstration présente :
- l’interface web
- le fonctionnement global de la plateforme
- les mécanismes de sécurité (codes 403 et 429)

## 6. Conclusion
Ce projet met en évidence l’importance de la sécurité côté serveur.
L’approche STRIDE a permis d’identifier et de corriger les principales menaces
dans un contexte de plateforme e-commerce.
