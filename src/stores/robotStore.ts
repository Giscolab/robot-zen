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
  updateSensors: () => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;

  // Terminal
  terminalLines: TerminalLine[];
  addTerminalLine: (line: Omit<TerminalLine, 'id' | 'timestamp'>) => void;
  processCommand: (cmd: string) => void;
}

const MONIQUE_RESPONSES = [
  "Bien sûr mon chou ! Je m'en occupe tout de suite. 💅",
  "Oh là là, quelle question ! Laisse-moi réfléchir... 🤔",
  "Tu sais quoi ? T'as raison. Monique approuve ! ✨",
  "Pas de souci, je gère ça comme une pro ! 💪",
  "Hmm, intéressant... Monique analyse la situation... 🧐",
];

const ROBERT_RESPONSES = [
  "Affirmatif. Exécution en cours. 🔧",
  "Paramètres reçus. Calcul en progression... ⚙️",
  "Analyse complète. Résultat optimal atteint. 📊",
  "Commande validée. Processus initialisé. 🤖",
  "Roger. Traitement des données en cours... 💾",
];

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

  sensors: { temperature: 22.5, distance: 150, light: 680, sound: 45 },
  updateSensors: () =>
    set({
      sensors: {
        temperature: 20 + Math.random() * 8,
        distance: 50 + Math.random() * 300,
        light: 200 + Math.random() * 800,
        sound: 20 + Math.random() * 60,
      },
    }),

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
      const { personality } = get();
      const responses = personality === 'monique' ? MONIQUE_RESPONSES : ROBERT_RESPONSES;
      const response = responses[Math.floor(Math.random() * responses.length)];

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
      store.addTerminalLine({ type: 'output', text: 'Commands: status, sensors, energy, emotion <name>, personality <name>, servo <name> <value>, clear, help' });
    } else if (c === 'status') {
      store.addTerminalLine({ type: 'output', text: `Connected: ${store.connected} | Energy: ${store.energy}% | Emotion: ${store.emotion} | Personality: ${store.personality}` });
    } else if (c === 'sensors') {
      const s = store.sensors;
      store.addTerminalLine({ type: 'output', text: `Temp: ${s.temperature.toFixed(1)}°C | Dist: ${s.distance.toFixed(0)}cm | Light: ${s.light.toFixed(0)}lux | Sound: ${s.sound.toFixed(0)}dB` });
    } else if (c === 'energy') {
      store.addTerminalLine({ type: 'output', text: `Energy: ${store.energy}%` });
    } else if (c.startsWith('emotion ')) {
      const e = c.split(' ')[1] as Emotion;
      store.setEmotion(e);
      store.addTerminalLine({ type: 'output', text: `Emotion set to: ${e}` });
    } else if (c.startsWith('personality ')) {
      const p = c.split(' ')[1] as Personality;
      store.setPersonality(p);
      store.addTerminalLine({ type: 'output', text: `Personality switched to: ${p}` });
    } else if (c === 'clear') {
      set({ terminalLines: [] });
    } else {
      store.addTerminalLine({ type: 'error', text: `Unknown command: ${cmd}` });
    }
  },
}));
