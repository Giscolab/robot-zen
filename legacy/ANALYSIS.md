# Rapport d'Analyse du Projet : Robot AI Local 🤖

## 1. Introduction
Ce rapport présente une analyse exhaustive du projet **Robot AI Local**, un système de simulation et de monitoring de robots IA utilisant une stack web moderne (Node.js, Express, Three.js). Le projet vise à fournir une interface interactive pour interagir avec des robots virtuels ("Monique" et "Robert") tout en simulant des contraintes physiques (énergie, servos).

---

## 2. Architecture Technique

### 🏗️ Structure Globale
Le projet suit une architecture modulaire Client/Serveur :
- **Backend (`src/server/`)** : Un serveur Express minimaliste gérant les routes HTTP et les connexions WebSocket.
- **Frontend (`src/client/`, `src/components/`, `src/core/`, `src/robot/`)** : Une application SPA (Single Page Application) construite en Vanilla JS avec des modules ES6, gérée par Vite.

### 🔄 Flux de Données
Le cœur de la communication repose sur le protocole **WebSocket** :
1. Le serveur envoie de la télémétrie (température, charge moteur, alertes).
2. Le client reçoit ces données via `RobotWebSocket.js`, les valide et met à jour les systèmes locaux (`energy.js`, `servo.js`).
3. L'UI (DOM) est mise à jour dynamiquement pour refléter l'état du robot.

---

## 3. Robotique & Simulation

### 🤖 Personnalités (Monique & Robert)
- **Monique** : Un robot plus complexe avec un cycle d'émotions automatique (neutre, heureuse, colère, etc.) et des animations oculaires détaillées (pupilles, clignotements).
- **Robert** : Un robot plus simple avec des clignotements et des mouvements de rotation aléatoires.
- *Note : Actuellement, les personnalités sont principalement définies par des comportements visuels et des stubs de texte.*

### ⚡ Systèmes Internes
- **Énergie** : Un moniteur simule la consommation électrique en temps réel en fonction de l'activité (CPU, mouvement des servos, couleur des LED).
- **Émotions** : Un système centralisé (`emotion.js`) pilote l'apparence visuelle du robot via des variables CSS (`--eye-color`, `--led-color`).
- **Servomoteurs** : Simulation du contrôle de la position (0-180°) des servos X et Y.

---

## 4. Sécurité & Fiabilité

### 🔐 Authentification & Intégrité
- **HMAC** : Le client implémente une vérification de signature HMAC pour les messages WebSocket entrants (`validateMessage`), utilisant une clé en dur (`secret-key`).
- **Auth** : Un système d'authentification est présent dans `CoreSystem.js` mais est actuellement passif (retourne toujours `true`).

### ⚠️ Points de Vigilance
- **Clés en dur** : La clé HMAC "secret-key" est codée en dur dans le code source.
- **Incohérence Serveur/Client** : Le serveur envoie des chaînes de texte simples alors que le client attend un format spécifique `message|signature`.

---

## 5. UI/UX & Interactions

### 🎨 Interface Utilisateur
L'UI utilise un thème "Dark Mode" très typé "Cyberpunk/Robotique" avec :
- Un système de logs interactif.
- Des composants modulaires (Chat, Terminal, Panneau de Contrôle).
- Des animations fluides basées sur le CSS (`cubic-bezier`, `transform-style: preserve-3d`).

### ⌨️ Expérience Interactive
- **Chat** : Permet une interaction textuelle (réponses simulées).
- **Terminal** : Simule un accès SSH pour l'exécution de commandes système.

---

## 6. Incohérences & Bugs Potentiels (Critique)

1. **Portée des fonctions (Modules ES6)** : Les fonctions comme `processCommand()` ou `updateServo()` sont définies dans des modules mais appelées via des attributs HTML `onclick`. En environnement de modules Vite, ces fonctions ne sont pas globales et l'UI risque de ne pas fonctionner sans attachement manuel à `window`.
2. **WebSocket Break** : Le serveur actuel (`server.js`) ne respecte pas le protocole de signature attendu par le client (`websocket.js`). Les messages seront rejetés par le client.
3. **Fichiers Squelettes** : Plusieurs fichiers comme `src/core/scene.js`, `src/robot/sensor.js` et `src/modules/EnhancedRobot3D.js` sont vides ou contiennent uniquement des stubs.
4. **Imports dans main.js** : Des imports pointent vers des fichiers inexistants ou mal nommés (ex: `@/modules/RobotTerminal.js` vs structure réelle).

---

## 7. Recommandations

### 🛠️ Court Terme (Priorité Haute)
- **Synchroniser le protocole WS** : Mettre à jour `server.js` pour envoyer des messages au format attendu (`{JSON}|signature`).
- **Fixer la portée globale** : Exposer les fonctions d'interaction à `window` ou utiliser `addEventListener` dans les composants JS.
- **Nettoyer les imports** : Corriger les chemins d'accès dans `main.js`.

### 🚀 Moyen/Long Terme
- **Intégration Three.js Réelle** : Implémenter le chargement du modèle `robot-manuel.gltf` (cité dans le README mais absent du code actif).
- **Vraie IA** : Remplacer le générateur de réponse simulé par un appel API vers un LLM local (Ollama) ou distant.
- **Sécurisation** : Déplacer les secrets vers un fichier `.env` et implémenter une vraie validation JWT.

---
*Rapport généré par Jules (Agent IA) pour l'analyse du projet Robot AI Local.*
