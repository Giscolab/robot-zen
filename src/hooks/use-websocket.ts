import { useEffect, useCallback, useRef } from 'react';
import { useRobotStore } from '@/stores/robotStore';
import { toast } from 'sonner';

const WS_URL = 'ws://localhost:8080';
const HMAC_SECRET = 'secret-key';

export const useRobotWebSocket = () => {
  const { setConnected, updateSensors, setServo, addTerminalLine } = useRobotStore();
  const socketRef = useRef<WebSocket | null>(null);

  const signMessage = async (message: string) => {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(HMAC_SECRET);
    const msgData = encoder.encode(message);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, msgData);
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const validateMessage = useCallback(async (data: string) => {
    try {
      const [message, hexSignature] = data.split('|');
      if (!message || !hexSignature) return false;

      const encoder = new TextEncoder();
      const keyData = encoder.encode(HMAC_SECRET);
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const signatureBytes = new Uint8Array(
        hexSignature.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      );

      return await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBytes,
        encoder.encode(message)
      );
    } catch {
      return false;
    }
  }, []);

  const connect = useCallback(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      addTerminalLine({ type: 'system', text: 'WebSocket connected and secured' });
      toast.success('Robot connecté via WebSocket');
    };

    socket.onmessage = async (event) => {
      if (!await validateMessage(event.data)) {
        addTerminalLine({ type: 'error', text: 'Received unsigned or invalid message' });
        return;
      }

      const payload = JSON.parse(event.data.split('|')[0]);

      switch (payload.type) {
        case 'telemetry':
          updateSensors({
            voltage: payload.sensors.voltage,
            current: payload.sensors.current,
            motorLoad: payload.sensors.motorLoad,
          });
          break;
        case 'hardware':
          if (payload.axis === 'X') setServo('head', payload.value);
          break;
        case 'alert':
          toast.info(payload.message);
          addTerminalLine({ type: 'system', text: `ALERT: ${payload.message}` });
          break;
      }
    };

    socket.onclose = () => {
      setConnected(false);
      addTerminalLine({ type: 'system', text: 'WebSocket disconnected' });
      setTimeout(connect, 3000);
    };

    socket.onerror = () => {
      addTerminalLine({ type: 'error', text: 'WebSocket error' });
    };
  }, [setConnected, updateSensors, setServo, addTerminalLine, validateMessage]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  const sendMessage = async (payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify(payload);
      // In a real scenario, we might also want to sign outgoing messages if the server expects it
      socketRef.current.send(message);
    }
  };

  return { sendMessage };
};
