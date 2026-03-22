import { useState } from "react";
import { Plus, X, Droplets, SmilePlus, Stethoscope } from "lucide-react";

interface FloatingActionButtonProps {
  onLogPeriod: () => void;
  onLogMood: () => void;
  onLogSymptoms: () => void;
}

const FloatingActionButton = ({ onLogPeriod, onLogMood, onLogSymptoms }: FloatingActionButtonProps) => {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: Droplets, label: "Log Period", color: "from-primary to-bubblegum", onClick: onLogPeriod },
    { icon: SmilePlus, label: "Log Mood", color: "from-sunflower to-coral", onClick: onLogMood },
    { icon: Stethoscope, label: "Symptoms", color: "from-mint to-seafoam", onClick: onLogSymptoms },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Action items */}
      {open && actions.map((action, i) => (
        <button
          key={action.label}
          onClick={() => { action.onClick(); setOpen(false); }}
          className="flex items-center gap-2 animate-slide-up"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <span className="px-3 py-1.5 rounded-full bg-card shadow-lg text-xs font-bold text-foreground border border-border">
            {action.label}
          </span>
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg text-primary-foreground hover:scale-110 transition-transform`}>
            <action.icon className="w-5 h-5" />
          </div>
        </button>
      ))}

      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110
          ${open ? "rotate-45" : "animate-gentle-pulse"}`}
        style={{ boxShadow: "0 8px 30px -4px hsla(340,75%,55%,0.4)" }}
      >
        {open ? <X className="w-6 h-6 text-primary-foreground" /> : <Plus className="w-6 h-6 text-primary-foreground" />}
      </button>
    </div>
  );
};

export default FloatingActionButton;
