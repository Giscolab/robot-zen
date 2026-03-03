import { useEffect } from 'react';
import {
  Sliders, Thermometer, Eye, Sun, Volume2,
  SmilePlus, Frown, Meh, Angry, Zap, HelpCircle, Moon,
} from 'lucide-react';
import { useRobotStore, type Emotion, type Personality } from '@/stores/robotStore';
import { Slider } from '@/components/ui/slider';

const EMOTIONS: { value: Emotion; label: string; icon: React.ElementType }[] = [
  { value: 'neutral', label: 'Neutre', icon: Meh },
  { value: 'happy', label: 'Heureux', icon: SmilePlus },
  { value: 'sad', label: 'Triste', icon: Frown },
  { value: 'angry', label: 'Colère', icon: Angry },
  { value: 'surprised', label: 'Surpris', icon: Zap },
  { value: 'curious', label: 'Curieux', icon: HelpCircle },
  { value: 'tired', label: 'Fatigué', icon: Moon },
];

const ControlPanel = () => {
  const {
    energy, servos, setServo, sensors, updateSensors,
    emotion, setEmotion, personality, setPersonality,
  } = useRobotStore();

  useEffect(() => {
    const id = setInterval(updateSensors, 3000);
    return () => clearInterval(id);
  }, [updateSensors]);

  return (
    <div className="panel flex flex-col h-full overflow-y-auto">
      <div className="panel-header">
        <Sliders className="h-3.5 w-3.5 text-primary" />
        <span>Contrôles</span>
      </div>

      <div className="p-3 space-y-5 text-sm">
        {/* Energy */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Énergie</h3>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${energy}%`,
                background: energy > 50
                  ? 'hsl(var(--success))'
                  : energy > 20
                  ? 'hsl(var(--warning))'
                  : 'hsl(var(--destructive))',
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono mt-1 block">{energy.toFixed(1)}%</span>
        </section>

        {/* Personality */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Personnalité</h3>
          <div className="flex gap-2">
            {(['monique', 'robert'] as Personality[]).map((p) => (
              <button
                key={p}
                onClick={() => setPersonality(p)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                  personality === p
                    ? 'bg-primary text-primary-foreground glow-primary'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* Emotions */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Émotion</h3>
          <div className="grid grid-cols-4 gap-1.5">
            {EMOTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setEmotion(value)}
                className={`flex flex-col items-center gap-1 py-2 rounded-md text-[10px] transition-all ${
                  emotion === value
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Servos */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Servos</h3>
          <div className="space-y-3">
            {(Object.keys(servos) as (keyof typeof servos)[]).map((key) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize text-secondary-foreground">{key}</span>
                  <span className="font-mono text-muted-foreground">{servos[key]}°</span>
                </div>
                <Slider
                  value={[servos[key]]}
                  max={180}
                  step={1}
                  onValueChange={([v]) => setServo(key, v)}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Sensors */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Capteurs</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Thermometer, label: 'Temp', value: `${sensors.temperature.toFixed(1)}°C` },
              { icon: Eye, label: 'Distance', value: `${sensors.distance.toFixed(0)}cm` },
              { icon: Sun, label: 'Lumière', value: `${sensors.light.toFixed(0)}lux` },
              { icon: Volume2, label: 'Son', value: `${sensors.sound.toFixed(0)}dB` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-muted rounded-md p-2 flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                <div>
                  <div className="text-[10px] text-muted-foreground">{label}</div>
                  <div className="text-xs font-mono text-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ControlPanel;
