
```markdown
# 🤖 Robot AI Local

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node->=18.0.0-brightgreen.svg)
![Three.js](https://img.shields.io/badge/Three.js-3D-black.svg)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple.svg)

**Robot AI Local** est une interface web interactive et un serveur local permettant de simuler, monitorer et interagir avec des intelligences artificielles robotiques (notamment "Monique" et "Robert"). Le projet intègre une visualisation 3D, une communication en temps réel par WebSocket, ainsi qu'un système complet de gestion de l'état du robot (énergie, émotions, capteurs, servos).

---

## ✨ Fonctionnalités Principales

- **🎮 Visualisation 3D en temps réel** : Rendu interactif du robot (`robot-manuel.gltf`) grâce à Three.js.
- **⚡ Communication Bidirectionnelle** : Architecture Client/Serveur connectée en temps réel via WebSockets.
- **🔋 Simulation de Systèmes** : Gestion poussée de la mécanique et de l'IA (Énergie, Capteurs, Servomoteurs, Émotions).
- **🗣️ Interface Multitâche** : 
  - Chat conversationnel avec l'IA.
  - Panneau de contrôle des paramètres.
  - Terminal de commandes intégré.
  - Composant d'expression faciale.
- **🤖 Personnalités Multiples** : Support de différents profils de robots (`monique.js`, `robert.js`).

---

## 🛠️ Stack Technique

- **Frontend** : Vanilla JS (Modules ES6), HTML5/CSS3
- **Moteur 3D** : [Three.js](https://threejs.org/)
- **Bundler & Dev Server** : [Vite](https://vitejs.dev/)
- **Backend** : Node.js, [Express](https://expressjs.com/)
- **Temps Réel** : WebSockets (`ws`)
- **Utilitaires** : Concurrently, Nodemon, ESLint

---

## 📂 Architecture du Projet

Le code source est divisé de manière modulaire dans le dossier `src/` :

```text
robot-ai-local/
├── public/                 # Assets statiques (Modèles 3D GLTF, fichiers CSS)
├── src/
│   ├── client/             # Point d'entrée Frontend (main.js)
│   ├── components/         # Composants UI isolés (Chat, Terminal, ControlPanel, Face)
│   ├── core/               # Systèmes vitaux (CoreSystem, Scene 3D, WebSocket, Logger)
│   ├── modules/            # Extensions et plugins (EnhancedRobot3D, RobotTerminal)
│   ├── robot/              # Logique interne des robots (Énergie, Capteurs, Servos, Émotions)
│   └── server/             # Backend Node.js / Express / WebSocket (server.js)
├── index.html              # Fichier HTML racine
├── vite.config.js          # Configuration du bundler Vite
└── package.json            # Dépendances et scripts NPM
```

---

## 🚀 Démarrage Rapide

### 1. Prérequis
Assurez-vous d'avoir **Node.js** installé sur votre machine.

### 2. Installation
Clonez le dépôt et installez les dépendances :
```bash
npm install
```

### 3. Lancer l'environnement de développement
Pour démarrer simultanément le serveur backend (via Nodemon) et le client frontend (via Vite) :
```bash
npm run dev
```
*Le frontend sera accessible à l'adresse locale fournie par Vite (généralement `http://localhost:5173`), et le serveur WebSocket tournera en arrière-plan.*

### 4. Build pour la production
Pour compiler les fichiers clients optimisés dans un dossier `dist/` :
```bash
npm run build
```

### 5. Lancer en production
Pour démarrer uniquement le serveur Node.js avec les fichiers buildés :
```bash
npm run start
```

---

## 📝 Configuration (Variables d'environnement)

Le projet utilise `dotenv`. Vous pouvez créer un fichier `.env` à la racine pour configurer votre serveur (ex: Port du serveur, clés API si besoin pour l'IA, etc.).

---

## 🤝 Contribution
L'architecture est pensée pour être facilement extensible. Pour ajouter une nouvelle fonctionnalité à un robot, créez un module dans `src/robot/` et connectez-le au `CoreSystem`.

---

*Développé avec passion pour l'exploration de la robotique et de l'IA locale.* 🚀
```

***
