import { useMemo } from 'react';
import { useRobotStore, type Emotion } from '@/stores/robotStore';

interface EyeConfig {
  scaleX: number;
  scaleY: number;
  offsetY: number;
}

interface MouthConfig {
  curve: number; // positive = smile, negative = frown
  width: number;
  open: number;
}

interface BrowConfig {
  angle: number; // degrees, positive = raised
  offsetY: number;
}

interface FaceConfig {
  eyes: EyeConfig;
  mouth: MouthConfig;
  brows: BrowConfig;
  color: string;
}

const FACE_CONFIGS: Record<Emotion, FaceConfig> = {
  neutral: {
    eyes: { scaleX: 1, scaleY: 1, offsetY: 0 },
    mouth: { curve: 0, width: 30, open: 0 },
    brows: { angle: 0, offsetY: 0 },
    color: '#06b6d4',
  },
  happy: {
    eyes: { scaleX: 1.1, scaleY: 0.7, offsetY: -1 },
    mouth: { curve: 12, width: 36, open: 4 },
    brows: { angle: 5, offsetY: -2 },
    color: '#22c55e',
  },
  sad: {
    eyes: { scaleX: 0.9, scaleY: 1.1, offsetY: 2 },
    mouth: { curve: -10, width: 24, open: 0 },
    brows: { angle: -12, offsetY: 3 },
    color: '#3b82f6',
  },
  angry: {
    eyes: { scaleX: 1.2, scaleY: 0.6, offsetY: 0 },
    mouth: { curve: -6, width: 28, open: 2 },
    brows: { angle: -20, offsetY: -4 },
    color: '#ef4444',
  },
  surprised: {
    eyes: { scaleX: 1.3, scaleY: 1.3, offsetY: -2 },
    mouth: { curve: 0, width: 18, open: 12 },
    brows: { angle: 15, offsetY: -6 },
    color: '#eab308',
  },
  curious: {
    eyes: { scaleX: 1.15, scaleY: 1.15, offsetY: -1 },
    mouth: { curve: 3, width: 20, open: 2 },
    brows: { angle: 10, offsetY: -3 },
    color: '#a855f7',
  },
  tired: {
    eyes: { scaleX: 1, scaleY: 0.4, offsetY: 3 },
    mouth: { curve: -3, width: 26, open: 6 },
    brows: { angle: -5, offsetY: 4 },
    color: '#6b7280',
  },
};

const Face = () => {
  const emotion = useRobotStore((s) => s.emotion);
  const config = useMemo(() => FACE_CONFIGS[emotion], [emotion]);

  const { eyes, mouth, brows, color } = config;

  // Mouth path
  const mouthPath = useMemo(() => {
    const hw = mouth.width / 2;
    if (mouth.open > 0) {
      // Open mouth (ellipse-ish)
      return `M ${50 - hw} 68 Q 50 ${68 + mouth.curve + mouth.open} ${50 + hw} 68 Q 50 ${68 - mouth.curve + mouth.open * 0.5} ${50 - hw} 68 Z`;
    }
    return `M ${50 - hw} 68 Q 50 ${68 + mouth.curve} ${50 + hw} 68`;
  }, [mouth]);

  return (
    <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
      <svg
        viewBox="0 0 100 100"
        width="120"
        height="120"
        className="drop-shadow-lg"
        style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
      >
        {/* Background */}
        <rect
          x="5" y="5" width="90" height="90" rx="16"
          fill="hsl(222 47% 11% / 0.85)"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />

        {/* Left brow */}
        <line
          x1="28" y1={38 + brows.offsetY}
          x2="42" y2={38 + brows.offsetY}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transition: 'all 0.4s ease',
            transform: `rotate(${-brows.angle}deg)`,
            transformOrigin: '35px 38px',
          }}
        />

        {/* Right brow */}
        <line
          x1="58" y1={38 + brows.offsetY}
          x2="72" y2={38 + brows.offsetY}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transition: 'all 0.4s ease',
            transform: `rotate(${brows.angle}deg)`,
            transformOrigin: '65px 38px',
          }}
        />

        {/* Left eye */}
        <ellipse
          cx="35" cy={48 + eyes.offsetY}
          rx={7 * eyes.scaleX} ry={7 * eyes.scaleY}
          fill={color}
          style={{ transition: 'all 0.4s ease' }}
        />
        {/* Left pupil */}
        <ellipse
          cx="36" cy={47 + eyes.offsetY}
          rx={3 * eyes.scaleX} ry={3 * eyes.scaleY}
          fill="white"
          opacity="0.7"
          style={{ transition: 'all 0.4s ease' }}
        />

        {/* Right eye */}
        <ellipse
          cx="65" cy={48 + eyes.offsetY}
          rx={7 * eyes.scaleX} ry={7 * eyes.scaleY}
          fill={color}
          style={{ transition: 'all 0.4s ease' }}
        />
        {/* Right pupil */}
        <ellipse
          cx="66" cy={47 + eyes.offsetY}
          rx={3 * eyes.scaleX} ry={3 * eyes.scaleY}
          fill="white"
          opacity="0.7"
          style={{ transition: 'all 0.4s ease' }}
        />

        {/* Mouth */}
        <path
          d={mouthPath}
          fill={mouth.open > 0 ? `${color}60` : 'none'}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'all 0.4s ease' }}
        />

        {/* Label */}
        <text
          x="50" y="92"
          textAnchor="middle"
          fill={color}
          fontSize="7"
          fontFamily="JetBrains Mono, monospace"
          opacity="0.6"
        >
          {emotion.toUpperCase()}
        </text>
      </svg>
    </div>
  );
};

export default Face;
