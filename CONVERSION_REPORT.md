# Rapport de Conversion Legacy vers React

Ce rapport détaille l'état de la conversion des fichiers du dossier `legacy` vers la nouvelle architecture React.

## État des Lieux Global

| Fichier Legacy | Équivalent React | État | Notes |
| :--- | :--- | :--- | :--- |
| **Client & Core** | | | |
| `client/main.js` | `main.tsx`, `App.tsx` | Partiel | Contient des classes `EnergyMonitor` et `EnergyAnalyzer` avec des calculs de consommation non portés. |
| `core/websocket.js` | - | **Manquant** | Gère la connexion sécurisée via HMAC. Indispensable pour la télémétrie réelle. |
| `core/CoreSystem.js` | - | **Manquant** | Gère la configuration (dev/simu/prod) et l'importation de clé HMAC. |
| `core/logger.js` | `robotStore.ts` (`terminalLines`) | Doublon | La logique de log est intégrée au store du terminal. |
| `core/scene.js` | - | Ignoré | Fichier vide dans legacy. |
| **Serveur** | | | |
| `server/server.js` | - | **Manquant** | Serveur Express/WS. Doit être intégré/maintenu pour le fonctionnement du projet. |
| **Composants UI** | | | |
| `components/ControlPanel.js` | `ControlPanel.tsx` | Doublon | Interface de contrôle portée avec Tailwind. |
| `components/ChatComponent.js` | `Chat.tsx` | Doublon | Système de chat avec gestion de personnalité portée. |
| `components/TerminalComponent.js`| `Terminal.tsx` | Doublon | Interface terminal portée. |
| `components/FaceComponent.js` | `Face.tsx` / `Robot3D.tsx` | Doublon | Les visuels 2D et 3D sont bien séparés en React. |
| `components/RobertComponent.js` | `Robot3D.tsx` | Partiel | La logique spécifique de rotation aléatoire de Robert n'est pas strictement identique. |
| `components/MoniqueComponent.js`| `Robot3D.tsx` | Doublon | Intégré dans la visualisation 3D. |
| **Logique Robot** | | | |
| `robot/emotion.js` | `robotStore.ts` / `Face.tsx` | Doublon | États émotionnels et couleurs portés. |
| `robot/energy.js` | `robotStore.ts` | Partiel | Legacy a une décomposition (CPU/Motors/LEDs) plus fine de la consommation. |
| `robot/servo.js` | `robotStore.ts` | Doublon | Gestion des servos via le store. |
| `robot/robert.js` | `robotStore.ts` | Doublon | Initialisation simple déjà gérée par les états par défaut du store. |
| `robot/monique.js` | `robotStore.ts` | Doublon | Idem Robert. |
| `robot/sensor.js` | `robotStore.ts` | Doublon | Bien que vide dans legacy, React implémente déjà des stubs de capteurs. |
| **Modules** | | | |
| `modules/EnhancedRobot3D.js` | `Robot3D.tsx` | Doublon | React utilise Three.js via `@react-three/fiber`. |
| `modules/RobotTerminal.js` | `robotStore.ts` | Doublon | La logique de commande est dans le store. |

## Actions Requises pour la Fusion

1.  **Sécurité & WebSocket** : Implémenter la validation HMAC dans un hook `useWebSocket` ou dans le `robotStore`.
2.  **Configuration** : Porter la gestion des environnements de `CoreSystem.js`.
3.  **Analyse Énergie** : Enrichir le store React avec les calculs détaillés de `EnergyMonitor` (V*I, efficacité moteur).
4.  **Backend** : Intégrer `server.js` au projet (ex: dossier `/server` à la racine) et s'assurer que le store React s'y connecte.
5.  **Intentions Squelettes** : Aucun impact majeur car les squelettes legacy étaient moins avancés que la version React actuelle.
