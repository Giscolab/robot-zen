# 🤖 Robot AI Local

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)

> **Interface cyberpunk de simulation robotique** — Visualisation 3D temps réel, terminal CLI avancé, chat IA multi-personnalités et panneau de contrôle complet. Tout dans le navigateur.

---

## 🖥️ Aperçu

L'interface se déploie en **3 colonnes** sur un fond sombre cybernétique :

| 💬 Chat IA | 🤖 Robot 3D + Face | 🎛️ Contrôles + Terminal |
|---|---|---|
| Conversation avec Monique ou Robert | Robot procédural interactif avec expressions faciales | Sliders servos, capteurs, émotions, CLI |

Sur mobile, le layout s'empile verticalement avec navigation par onglets.

---

## ✨ Fonctionnalités

### 🦾 Robot 3D Procédural
- Modélisation géométrique complète (tête, torse, bras, jambes)
- **6 servos** contrôlables en temps réel (tête, bras, base, pince)
- Animations enchaînées : `demo`, `combat`, `patrol`, `stretch`, `dance`
- Rendu Three.js avec éclairage dynamique et grille au sol

### 😀 Expressions Faciales (Face)
- **7 émotions** : neutre, joie, tristesse, colère, surprise, curiosité, fatigue
- Yeux, bouche et sourcils animés par transitions CSS
- Superposition sur la vue 3D en temps réel

### 💻 Terminal CLI (20+ commandes)

| Commande | Description |
|---|---|
| `help` | Affiche toutes les commandes disponibles |
| `status` | État complet du robot (servos, énergie, émotion) |
| `servo <nom> <valeur>` | Contrôle direct d'un servo (0-180°) |
| `emotion <nom>` | Change l'expression faciale |
| `diagnostic` | Rapport système détaillé |
| `scan` | Analyse de l'environnement |
| `reset` | Réinitialise tous les servos |
| `dance` | Séquence de danse |
| `demo` | 🎬 Démonstration complète (6 phases, ~15s) |
| `combat` | Posture de combat et combos |
| `patrol` | Routine de patrouille avec scan |
| `stretch` | Séquence d'étirement |
| `emotions` | Cycle à travers les 7 expressions |
| `matrix` | Animation style Matrix |
| `monique` / `robert` | Changer de personnalité IA |
| `clear` | Efface le terminal |
| `ping` | Test de latence |
| `uptime` | Temps de fonctionnement |
| `energy` | Niveau d'énergie actuel |
| `sensors` | Données des capteurs |
| `version` | Version du système |

### 🧠 Chat IA — Deux Personnalités

| | **Monique** 🌸 | **Robert** 🔧 |
|---|---|---|
| **Ton** | Chaleureux, empathique | Technique, précis |
| **Style** | Émojis, encouragements | Données, métriques |
| **Spécialité** | Interaction humaine | Diagnostic système |
| **Réponses** | Contextuelles selon l'émotion | Analytiques et factuelles |

### 🎛️ Panneau de Contrôle
- Sliders pour chaque servo avec valeurs en temps réel
- Boutons d'émotions avec retour visuel
- Indicateurs de capteurs (température, distance, lumière, batterie)
- Barre d'énergie dynamique

---

## 🛠️ Stack Technique

| Couche | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript 5, Vite 5 |
| **3D** | Three.js, @react-three/fiber, @react-three/drei |
| **État** | Zustand (store centralisé) |
| **UI** | Tailwind CSS 3, shadcn/ui, Lucide Icons |
| **Animations** | CSS Transitions, setTimeout sequences |
| **Communication** | WebSocket (préparé pour serveur Node.js) |

---

## 🚀 Démarrage Rapide

```bash
# Cloner le projet
git clone <URL_DU_DEPOT>
cd robot-ai-local

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`. Tapez `demo` dans le terminal pour une démonstration complète.

---

## 📁 Architecture

```
src/
├── components/
│   ├── Chat.tsx          # Interface de chat IA
│   ├── ControlPanel.tsx  # Sliders servos + capteurs
│   ├── Face.tsx          # Expressions faciales SVG
│   ├── Robot3D.tsx       # Scène Three.js du robot
│   ├── Terminal.tsx      # Terminal CLI interactif
│   ├── TopBar.tsx        # Barre de statut supérieure
│   └── ui/              # Composants shadcn/ui
├── stores/
│   └── robotStore.ts     # Store Zustand (servos, émotions, commandes)
├── hooks/
│   └── use-websocket.ts  # Hook WebSocket
├── pages/
│   └── Index.tsx         # Layout principal responsive
└── main.tsx              # Point d'entrée
```

---

## 🎮 Guide Rapide

1. **Ouvrez le terminal** (colonne droite) et tapez `help`
2. **Lancez `demo`** pour voir le robot en action
3. **Jouez avec les sliders** du panneau de contrôle
4. **Discutez** avec Monique ou Robert dans le chat
5. **Changez les émotions** et observez le visage du robot

---

## 🔮 Roadmap

- [ ] Chargement de modèle GLTF (`robot-manuel.gltf`)
- [ ] Connexion WebSocket au serveur Node.js
- [ ] Synthèse vocale et reconnaissance audio
- [ ] Pipeline robotique réel (Arduino/Raspberry Pi)
- [ ] Module IA locale (LLM embarqué)
- [ ] Autocomplétion des commandes avec Tab
- [ ] Historique persistant des conversations

---

*Développé avec passion pour l'exploration de la robotique et de l'IA locale.* 🚀
