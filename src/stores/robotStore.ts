import { create } from 'zustand';

export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'curious' | 'tired';
export type Personality = 'monique' | 'robert';

export interface ServoState {
  head: number;
  leftArm: number;
  rightArm: number;
  torso: number;
}

export interface SensorData {
  temperature: number;
  distance: number;
  light: number;
  sound: number;
  voltage?: number;
  current?: number;
  motorLoad?: number;
}

export interface EnergyDetails {
  cpu: number;
  motors: number;
  leds: number;
  total: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'robot';
  text: string;
  timestamp: Date;
  personality?: Personality;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
  timestamp: Date;
}

interface RobotStore {
  // Connection
  connected: boolean;
  setConnected: (v: boolean) => void;

  // Energy
  energy: number;
  setEnergy: (v: number) => void;

  // Emotion
  emotion: Emotion;
  setEmotion: (e: Emotion) => void;

  // Personality
  personality: Personality;
  setPersonality: (p: Personality) => void;

  // Servos
  servos: ServoState;
  setServo: (key: keyof ServoState, value: number) => void;

  // Sensors
  sensors: SensorData;
  updateSensors: (data?: Partial<SensorData>) => void;

  // Energy
  energyDetails: EnergyDetails;

  // Chat
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;

  // Terminal
  terminalLines: TerminalLine[];
  addTerminalLine: (line: Omit<TerminalLine, 'id' | 'timestamp'>) => void;
  processCommand: (cmd: string) => void;
}

const MONIQUE_RESPONSES: Record<string, string[]> = {
  neutral: [
    "Bien sûr mon chou ! Je m'en occupe tout de suite. 💅",
    "Oh là là, quelle question ! Laisse-moi réfléchir... 🤔",
    "Tu sais quoi ? T'as raison. Monique approuve ! ✨",
    "Pas de souci, je gère ça comme une pro ! 💪",
  ],
  happy: [
    "Oh c'est MERVEILLEUX ! Je suis aux anges ! 🌟💃",
    "Yaaay ! Monique est ravie de t'aider ! ✨😄",
    "Tout est parfait aujourd'hui ! On y va ! 🎉",
  ],
  sad: [
    "Snif... C'est pas ma journée mais je vais essayer... 😢",
    "Oh... Monique a un petit coup de blues... 💙",
    "C'est un peu triste mais bon... on continue... 🥺",
  ],
  angry: [
    "BON ! Ça suffit ! Monique va régler ça ! 😤💢",
    "Franchement ! C'est agaçant ! Mais soit... 😠",
    "Grrrr ! On va faire ça VITE et BIEN ! 💥",
  ],
  surprised: [
    "OH ! Je m'attendais PAS à ça du tout ! 😲✨",
    "Waouh ! C'est... inattendu ! Monique est scotchée ! 🤯",
  ],
  curious: [
    "Ooooh intéressant... Monique veut en savoir plus ! 🧐✨",
    "Hmm hmm ! Raconte-moi tout ! 🔍💅",
  ],
  tired: [
    "Bâillement... Oui oui, Monique écoute... 😴💤",
    "Zzz... Hein ? Ah oui, pardon... je suis crevée... 🥱",
  ],
};

const ROBERT_RESPONSES: Record<string, string[]> = {
  neutral: [
    "Affirmatif. Exécution en cours. 🔧",
    "Paramètres reçus. Calcul en progression... ⚙️",
    "Analyse complète. Résultat optimal atteint. 📊",
    "Commande validée. Processus initialisé. 🤖",
  ],
  happy: [
    "Excellent. Performance optimale confirmée. Satisfaction : 100%. ✅",
    "Opération réussie. Indicateurs au vert. 📈",
  ],
  sad: [
    "Erreur émotionnelle détectée. Fonctionnement dégradé... 📉",
    "Moral bas. Efficacité réduite à 47%... 🔵",
  ],
  angry: [
    "ALERTE. Seuil de tolérance dépassé. Mode offensif activé. 🔴",
    "Paramètres hors limites. Réponse forcée initialisée. ⚡",
  ],
  surprised: [
    "Donnée inattendue. Recalibration nécessaire... 📡",
    "Anomalie détectée. Ce résultat n'était pas prévu. ❓",
  ],
  curious: [
    "Requête intéressante. Analyse approfondie initialisée... 🔬",
    "Données fascinantes. Investigation en cours. 🧪",
  ],
  tired: [
    "Batterie faible. Mode économie activé... 🪫",
    "Cycles CPU réduits. Réponse... en... cours... 💤",
  ],
};

export const useRobotStore = create<RobotStore>((set, get) => ({
  connected: true,
  setConnected: (v) => set({ connected: v }),

  energy: 87,
  setEnergy: (v) => set({ energy: Math.max(0, Math.min(100, v)) }),

  emotion: 'neutral',
  setEmotion: (e) => set({ emotion: e }),

  personality: 'monique',
  setPersonality: (p) => set({ personality: p }),

  servos: { head: 90, leftArm: 45, rightArm: 45, torso: 0 },
  setServo: (key, value) =>
    set((s) => ({ servos: { ...s.servos, [key]: Math.max(0, Math.min(180, value)) } })),

  sensors: { temperature: 22.5, distance: 150, light: 680, sound: 45, voltage: 12, current: 0.5, motorLoad: 15 },
  updateSensors: (data) =>
    set((state) => {
      const newSensors = {
        ...state.sensors,
        temperature: data?.temperature ?? (20 + Math.random() * 8),
        distance: data?.distance ?? (50 + Math.random() * 300),
        light: data?.light ?? (200 + Math.random() * 800),
        sound: data?.sound ?? (20 + Math.random() * 60),
        voltage: data?.voltage ?? state.sensors.voltage,
        current: data?.current ?? state.sensors.current,
        motorLoad: data?.motorLoad ?? state.sensors.motorLoad,
      };

      // Ported logic from legacy/src/robot/energy.js
      const cpu = newSensors.temperature / 10;
      const motors = Math.abs(90 - state.servos.head) / 10; // Using head servo as proxy
      const leds = state.emotion === 'angry' ? 1 : state.emotion === 'happy' ? 0.3 : 0.1;
      const total = cpu + motors + leds;

      return {
        sensors: newSensors,
        energy: Math.max(0, Math.min(100, 100 - total * 5)), // Simple mapping to %
        energyDetails: { cpu, motors, leds, total }
      };
    }),

  energyDetails: { cpu: 2.2, motors: 0, leds: 0.1, total: 2.3 },

  messages: [
    {
      id: '1',
      sender: 'robot',
      text: "Bonjour ! Je suis Monique, votre assistante robotique préférée ! Comment puis-je vous aider aujourd'hui ? 💅✨",
      timestamp: new Date(),
      personality: 'monique',
    },
  ],
  addMessage: (msg) => {
    const id = crypto.randomUUID();
    set((s) => ({
      messages: [...s.messages, { ...msg, id, timestamp: new Date() }],
    }));

    if (msg.sender === 'user') {
      const { personality, emotion } = get();
      const responseMap = personality === 'monique' ? MONIQUE_RESPONSES : ROBERT_RESPONSES;
      const pool = responseMap[emotion] || responseMap['neutral'];
      const response = pool[Math.floor(Math.random() * pool.length)];

      setTimeout(() => {
        const rid = crypto.randomUUID();
        set((s) => ({
          messages: [
            ...s.messages,
            { id: rid, sender: 'robot', text: response, timestamp: new Date(), personality },
          ],
        }));
      }, 800 + Math.random() * 1200);
    }
  },

  terminalLines: [
    { id: '1', type: 'system', text: '🤖 Robot AI Local v1.0 — Terminal Ready', timestamp: new Date() },
    { id: '2', type: 'system', text: 'Type "help" for available commands.', timestamp: new Date() },
  ],
  addTerminalLine: (line) => {
    const id = crypto.randomUUID();
    set((s) => ({
      terminalLines: [...s.terminalLines, { ...line, id, timestamp: new Date() }],
    }));
  },
  processCommand: (cmd) => {
    const store = get();
    store.addTerminalLine({ type: 'input', text: `$ ${cmd}` });

    const c = cmd.trim().toLowerCase();
    if (c === 'help') {
      store.addTerminalLine({ type: 'system', text: '═══════════ COMMANDES DISPONIBLES ═══════════' });
      store.addTerminalLine({ type: 'output', text: '  status          — État général du robot' });
      store.addTerminalLine({ type: 'output', text: '  sensors         — Lecture des capteurs' });
      store.addTerminalLine({ type: 'output', text: '  energy          — Détails énergie & consommation' });
      store.addTerminalLine({ type: 'output', text: '  emotion <nom>   — Changer émotion (neutral|happy|sad|angry|surprised|curious|tired)' });
      store.addTerminalLine({ type: 'output', text: '  personality <p> — Changer personnalité (monique|robert)' });
      store.addTerminalLine({ type: 'output', text: '  servo <n> <v>   — Bouger servo (head|leftArm|rightArm|torso) 0-180' });
      store.addTerminalLine({ type: 'output', text: '  servos          — État de tous les servos' });
      store.addTerminalLine({ type: 'output', text: '  say <message>   — Faire parler le robot' });
      store.addTerminalLine({ type: 'output', text: '  ping            — Test de connexion' });
      store.addTerminalLine({ type: 'output', text: '  uptime          — Temps de fonctionnement' });
      store.addTerminalLine({ type: 'output', text: '  whoami          — Identité du robot actif' });
      store.addTerminalLine({ type: 'output', text: '  reboot          — Redémarrage simulé' });
      store.addTerminalLine({ type: 'output', text: '  diagnostic      — Diagnostic complet du système' });
      store.addTerminalLine({ type: 'output', text: '  dance           — Séquence de danse 💃' });
      store.addTerminalLine({ type: 'output', text: '  wave            — Faire un signe de la main 👋' });
      store.addTerminalLine({ type: 'output', text: '  reset           — Réinitialiser servos & émotion' });
      store.addTerminalLine({ type: 'output', text: '  history         — Historique des messages chat' });
      store.addTerminalLine({ type: 'output', text: '  clear           — Effacer le terminal' });
    } else if (c === 'status') {
      store.addTerminalLine({ type: 'output', text: `┌─── STATUS ───────────────────────────┐` });
      store.addTerminalLine({ type: 'output', text: `│ Connecté  : ${store.connected ? '✅ Oui' : '❌ Non'}` });
      store.addTerminalLine({ type: 'output', text: `│ Énergie   : ${'█'.repeat(Math.round(store.energy / 5))}${'░'.repeat(20 - Math.round(store.energy / 5))} ${store.energy.toFixed(0)}%` });
      store.addTerminalLine({ type: 'output', text: `│ Émotion   : ${store.emotion}` });
      store.addTerminalLine({ type: 'output', text: `│ Personnalité : ${store.personality}` });
      store.addTerminalLine({ type: 'output', text: `└──────────────────────────────────────┘` });
    } else if (c === 'sensors') {
      const s = store.sensors;
      store.addTerminalLine({ type: 'output', text: `┌─── CAPTEURS ─────────────────────────┐` });
      store.addTerminalLine({ type: 'output', text: `│ 🌡️  Température : ${s.temperature.toFixed(1)}°C` });
      store.addTerminalLine({ type: 'output', text: `│ 📏 Distance    : ${s.distance.toFixed(0)} cm` });
      store.addTerminalLine({ type: 'output', text: `│ 💡 Lumière     : ${s.light.toFixed(0)} lux` });
      store.addTerminalLine({ type: 'output', text: `│ 🔊 Son         : ${s.sound.toFixed(0)} dB` });
      store.addTerminalLine({ type: 'output', text: `│ ⚡ Voltage     : ${(s.voltage ?? 0).toFixed(1)} V` });
      store.addTerminalLine({ type: 'output', text: `│ 🔌 Courant     : ${(s.current ?? 0).toFixed(2)} A` });
      store.addTerminalLine({ type: 'output', text: `│ ⚙️  Charge mot. : ${(s.motorLoad ?? 0).toFixed(0)}%` });
      store.addTerminalLine({ type: 'output', text: `└──────────────────────────────────────┘` });
    } else if (c === 'energy') {
      const ed = store.energyDetails;
      store.addTerminalLine({ type: 'output', text: `┌─── ÉNERGIE ──────────────────────────┐` });
      store.addTerminalLine({ type: 'output', text: `│ Niveau  : ${'█'.repeat(Math.round(store.energy / 5))}${'░'.repeat(20 - Math.round(store.energy / 5))} ${store.energy.toFixed(0)}%` });
      store.addTerminalLine({ type: 'output', text: `│ CPU     : ${ed.cpu.toFixed(2)} W` });
      store.addTerminalLine({ type: 'output', text: `│ Moteurs : ${ed.motors.toFixed(2)} W` });
      store.addTerminalLine({ type: 'output', text: `│ LEDs    : ${ed.leds.toFixed(2)} W` });
      store.addTerminalLine({ type: 'output', text: `│ Total   : ${ed.total.toFixed(2)} W` });
      store.addTerminalLine({ type: 'output', text: `└──────────────────────────────────────┘` });
    } else if (c.startsWith('emotion ')) {
      const e = c.split(' ')[1] as Emotion;
      const valid: Emotion[] = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'curious', 'tired'];
      if (valid.includes(e)) {
        store.setEmotion(e);
        store.addTerminalLine({ type: 'output', text: `✅ Émotion changée → ${e}` });
      } else {
        store.addTerminalLine({ type: 'error', text: `❌ Émotion invalide. Valeurs : ${valid.join(', ')}` });
      }
    } else if (c.startsWith('personality ')) {
      const p = c.split(' ')[1] as Personality;
      const valid: Personality[] = ['monique', 'robert'];
      if (valid.includes(p)) {
        store.setPersonality(p);
        store.addTerminalLine({ type: 'output', text: `✅ Personnalité activée → ${p}` });
      } else {
        store.addTerminalLine({ type: 'error', text: `❌ Personnalité invalide. Valeurs : ${valid.join(', ')}` });
      }
    } else if (c.startsWith('servo ')) {
      const parts = c.split(' ');
      const name = parts[1] as keyof ServoState;
      const value = parseInt(parts[2]);
      if (name in store.servos && !isNaN(value)) {
        store.setServo(name, value);
        store.addTerminalLine({ type: 'output', text: `✅ Servo ${name} → ${value}°` });
      } else {
        store.addTerminalLine({ type: 'error', text: `❌ Usage : servo <head|leftArm|rightArm|torso> <0-180>` });
      }
    } else if (c === 'servos') {
      const sv = store.servos;
      store.addTerminalLine({ type: 'output', text: `┌─── SERVOS ───────────────────────────┐` });
      store.addTerminalLine({ type: 'output', text: `│ Tête      : ${sv.head}°` });
      store.addTerminalLine({ type: 'output', text: `│ Bras G    : ${sv.leftArm}°` });
      store.addTerminalLine({ type: 'output', text: `│ Bras D    : ${sv.rightArm}°` });
      store.addTerminalLine({ type: 'output', text: `│ Torse     : ${sv.torso}°` });
      store.addTerminalLine({ type: 'output', text: `└──────────────────────────────────────┘` });
    } else if (c.startsWith('say ')) {
      const message = cmd.trim().substring(4);
      if (message) {
        store.addMessage({ sender: 'robot', text: message, personality: store.personality });
        store.addTerminalLine({ type: 'output', text: `🗣️ ${store.personality} dit : "${message}"` });
      } else {
        store.addTerminalLine({ type: 'error', text: `❌ Usage : say <message>` });
      }
    } else if (c === 'ping') {
      const latency = Math.floor(Math.random() * 50 + 5);
      store.addTerminalLine({ type: 'output', text: `🏓 PONG ! Latence : ${latency}ms` });
    } else if (c === 'uptime') {
      const mins = Math.floor(Math.random() * 480 + 60);
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      store.addTerminalLine({ type: 'output', text: `⏱️ Uptime : ${h}h ${m}m` });
    } else if (c === 'whoami') {
      const p = store.personality;
      const desc = p === 'monique'
        ? '💅 Monique — IA expressive, chaleureuse et stylée'
        : '🔧 Robert — IA analytique, précise et méthodique';
      store.addTerminalLine({ type: 'output', text: desc });
    } else if (c === 'reboot') {
      store.addTerminalLine({ type: 'system', text: '🔄 Redémarrage en cours...' });
      store.addTerminalLine({ type: 'system', text: '   Arrêt des moteurs...' });
      store.addTerminalLine({ type: 'system', text: '   Sauvegarde état...' });
      store.addTerminalLine({ type: 'system', text: '   Réinitialisation capteurs...' });
      setTimeout(() => {
        store.addTerminalLine({ type: 'system', text: '✅ Système redémarré avec succès.' });
        store.updateSensors();
      }, 1500);
    } else if (c === 'diagnostic') {
      const s = store.sensors;
      const tempOk = s.temperature < 35;
      const voltOk = (s.voltage ?? 12) > 10;
      const energyOk = store.energy > 20;
      store.addTerminalLine({ type: 'system', text: '🔍 Diagnostic système en cours...' });
      store.addTerminalLine({ type: tempOk ? 'output' : 'error', text: `  Température : ${tempOk ? '✅ OK' : '⚠️ ÉLEVÉE'} (${s.temperature.toFixed(1)}°C)` });
      store.addTerminalLine({ type: voltOk ? 'output' : 'error', text: `  Voltage     : ${voltOk ? '✅ OK' : '⚠️ BAS'} (${(s.voltage ?? 0).toFixed(1)}V)` });
      store.addTerminalLine({ type: energyOk ? 'output' : 'error', text: `  Énergie     : ${energyOk ? '✅ OK' : '⚠️ FAIBLE'} (${store.energy.toFixed(0)}%)` });
      store.addTerminalLine({ type: 'output', text: `  Servos      : ✅ Opérationnels` });
      store.addTerminalLine({ type: 'output', text: `  WebSocket   : ${store.connected ? '✅ Connecté' : '❌ Déconnecté'}` });
      const issues = [!tempOk, !voltOk, !energyOk].filter(Boolean).length;
      store.addTerminalLine({ type: issues > 0 ? 'error' : 'system', text: `📋 Résultat : ${issues === 0 ? 'Tous les systèmes sont nominaux ✅' : `${issues} alerte(s) détectée(s) ⚠️`}` });
    } else if (c === 'dance') {
      store.addTerminalLine({ type: 'system', text: '💃 Séquence de danse lancée !' });
      const moves = [
        { head: 120, leftArm: 160, rightArm: 20, torso: 30 },
        { head: 60, leftArm: 20, rightArm: 160, torso: -30 },
        { head: 90, leftArm: 90, rightArm: 90, torso: 0 },
      ];
      moves.forEach((m, i) => {
        setTimeout(() => {
          Object.entries(m).forEach(([k, v]) => store.setServo(k as keyof ServoState, v));
          if (i === moves.length - 1) {
            store.addTerminalLine({ type: 'output', text: '🎵 Danse terminée ! Position de repos.' });
          }
        }, (i + 1) * 800);
      });
    } else if (c === 'wave') {
      store.addTerminalLine({ type: 'system', text: '👋 Salut !' });
      store.setServo('rightArm', 170);
      setTimeout(() => store.setServo('rightArm', 140), 400);
      setTimeout(() => store.setServo('rightArm', 170), 800);
      setTimeout(() => {
        store.setServo('rightArm', 45);
        store.addTerminalLine({ type: 'output', text: '✅ Geste terminé.' });
      }, 1200);
    } else if (c === 'reset') {
      store.setServo('head', 90);
      store.setServo('leftArm', 45);
      store.setServo('rightArm', 45);
      store.setServo('torso', 0);
      store.setEmotion('neutral');
      store.addTerminalLine({ type: 'system', text: '🔄 Servos et émotion réinitialisés.' });
    } else if (c === 'history') {
      const msgs = store.messages.slice(-10);
      store.addTerminalLine({ type: 'system', text: `📜 Derniers ${msgs.length} messages :` });
      msgs.forEach(m => {
        const tag = m.sender === 'user' ? '👤' : '🤖';
        store.addTerminalLine({ type: 'output', text: `  ${tag} ${m.text.substring(0, 60)}${m.text.length > 60 ? '...' : ''}` });
      });
    } else if (c === 'clear') {
      set({ terminalLines: [] });
    } else {
      store.addTerminalLine({ type: 'error', text: `❌ Commande inconnue : "${cmd}". Tapez "help" pour la liste.` });
    }
  },
}));
