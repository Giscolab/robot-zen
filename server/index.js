import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import crypto from 'node:crypto';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Robot AI Backend Running');
});

const PORT = 8080;
const HMAC_SECRET = process.env.WS_HMAC_SECRET || 'secret-key';

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

function signMessage(message) {
  return crypto.createHmac('sha256', HMAC_SECRET).update(message).digest('hex');
}

function sendSigned(ws, payload) {
  const message = JSON.stringify(payload);
  const signature = signMessage(message);
  ws.send(`${message}|${signature}`);
}

function randomFrom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

wss.on('connection', (ws) => {
  console.log('🔌 Client connected');

  sendSigned(ws, {
    type: 'alert',
    message: 'Robot AI Connected',
    timestamp: Date.now()
  });

  const telemetryLoop = setInterval(() => {
    sendSigned(ws, {
      type: 'telemetry',
      timestamp: Date.now(),
      sensors: {
        voltage: 12,
        current: Number((Math.random() * 3).toFixed(2)),
        motorLoad: randomFrom(5, 85)
      }
    });

    sendSigned(ws, {
      type: 'hardware',
      timestamp: Date.now(),
      axis: Math.random() > 0.5 ? 'X' : 'Y',
      value: randomFrom(0, 180)
    });
  }, 2000);

  ws.on('message', (message) => {
    console.log('📩 Message reçu:', message.toString());
  });

  ws.on('close', () => {
    clearInterval(telemetryLoop);
    console.log('❌ Client disconnected');
  });
});
