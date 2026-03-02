

# Robot AI Local -- Plan d'amelioration

## Etat actuel

L'application dispose deja de :
- Layout 3 colonnes (Chat | Robot 3D | Controles + Terminal)
- Store Zustand avec gestion des servos, emotions, personnalites, capteurs
- Robot 3D procedural (geometries basiques, pas de modele GLTF)
- Chat avec reponses simulees (Monique/Robert)
- Terminal interactif avec commandes CLI
- Panneau de controle (sliders servos, boutons emotions, capteurs)
- TopBar avec indicateurs de statut

## Elements manquants par rapport au README

1. **Composant Face** -- Expression faciale du robot (mentionne dans le README mais absent)
2. **Chargement du modele GLTF** -- Le README reference `robot-manuel.gltf`, actuellement le robot est procedural
3. **Theme sombre par defaut** -- Le README decrit un style cyber/sombre, mais le theme dark n'est pas active par defaut
4. **Commande servo dans le terminal** -- La commande `servo <name> <value>` est listee dans l'aide mais pas implementee
5. **Meilleure reactivite mobile** -- Le layout 3 colonnes ne s'adapte pas aux petits ecrans

## Plan d'implementation

### 1. Ajouter le composant Face (expression faciale)

Creer `src/components/Face.tsx` -- un composant SVG/Canvas qui affiche le visage du robot avec des expressions dynamiques basees sur l'emotion courante du store. Il sera integre en overlay sur la vue 3D ou dans un panneau dedie.

Expressions a supporter :
- Yeux (forme, taille, animation selon l'emotion)
- Bouche (courbe, ouverture)
- Sourcils (angle)
- Animations de transition entre emotions

### 2. Activer le theme sombre par defaut

Modifier `index.html` pour ajouter `class="dark"` sur la balise `<html>`, coherent avec l'esthetique cyber du projet.

### 3. Corriger la commande servo dans le terminal

Dans `robotStore.ts`, ajouter le parsing de la commande `servo <name> <value>` dans `processCommand` -- actuellement manquant bien que liste dans l'aide.

### 4. Ameliorer la responsivite mobile

Modifier `Index.tsx` pour empiler les colonnes sur mobile (breakpoint `md`). Sur petit ecran : TopBar, puis Robot 3D, puis onglets Chat/Controles/Terminal.

### 5. Enrichir les personnalites IA

Ajouter plus de reponses contextuelles pour Monique et Robert, et faire varier le ton selon l'emotion active du robot.

---

## Details techniques

### Face.tsx (nouveau fichier)

```text
+-- src/components/Face.tsx
    - Lit emotion depuis useRobotStore()
    - Rendu SVG avec animations CSS transitions
    - Yeux, bouche, sourcils parametres par emotion
    - Se superpose au canvas 3D (position absolute, z-index)
```

### robotStore.ts (modification)

Ajouter dans `processCommand` :
```text
else if (c.startsWith('servo ')) {
  const parts = c.split(' ');
  const name = parts[1] as keyof ServoState;
  const value = parseInt(parts[2]);
  if (name in store.servos && !isNaN(value)) {
    store.setServo(name, value);
    store.addTerminalLine({ type: 'output', text: `Servo ${name} set to ${value}` });
  } else {
    store.addTerminalLine({ type: 'error', text: `Invalid servo command` });
  }
}
```

### Index.tsx (modification)

Passer le layout en responsive :
- Desktop : flex-row 3 colonnes (inchange)
- Mobile (< md) : flex-col, Robot 3D en haut, puis tabs pour Chat/Controles/Terminal

### index.html (modification)

Ajouter `class="dark"` a `<html>` pour le theme sombre par defaut.

## Fichiers impactes

| Fichier | Action |
|---|---|
| `src/components/Face.tsx` | Creer |
| `src/stores/robotStore.ts` | Modifier (commande servo) |
| `src/pages/Index.tsx` | Modifier (responsive + Face) |
| `index.html` | Modifier (dark mode) |
| `src/components/Robot3D.tsx` | Modifier (overlay Face) |

