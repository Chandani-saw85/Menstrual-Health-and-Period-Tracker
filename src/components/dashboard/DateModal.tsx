import { useState } from "react";
import { format } from "date-fns";
import { MOODS, SYMPTOMS } from "@/lib/cycle-utils";
import { X } from "lucide-react";

interface DateModalProps {
  date: Date;
  onClose: () => void;
  onLogPeriod: (date: string) => void;
  onLogMood: (date: string, mood: string, label: string) => void;
  onLogSymptoms: (date: string, symptoms: string[]) => void;
  existingMood?: string;
  existingSymptoms?: string[];
  isPeriodDay?: boolean;
}

const DateModal = ({
  date, onClose, onLogPeriod, onLogMood, onLogSymptoms,
  existingMood, existingSymptoms = [], isPeriodDay,
}: DateModalProps) => {
  const [tab, setTab] = useState<"period" | "mood" | "symptoms">("period");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(existingSymptoms);
  const dateStr = format(date, "yyyy-MM-dd");

  const toggleSymptom = (s: string) =>
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-slide-up"
        style={{
          background: "linear-gradient(135deg, hsla(0,0%,100%,0.95), hsla(340,60%,98%,0.95))",
          backdropFilter: "blur(20px)",
          borderRadius: "2rem",
          border: "2px solid hsl(var(--border))",
          boxShadow: "0 25px 60px -12px hsla(340,75%,55%,0.2)",
          padding: "1.5rem",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              {format(date, "EEEE, MMM d")}
            </h3>
            <p className="text-xs text-muted-foreground font-body">What happened today?</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 p-1 rounded-2xl bg-muted/50">
          {(["period", "mood", "symptoms"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 capitalize
                ${tab === t
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t === "period" ? "🩸 Period" : t === "mood" ? "😊 Mood" : "💊 Symptoms"}
            </button>
          ))}
        </div>

        {/* Period Tab */}
        {tab === "period" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-body">
              {isPeriodDay
                ? "This day is already marked as a period day ✅"
                : "Mark this day as the start of your period"}
            </p>
            {!isPeriodDay && (
              <button
                onClick={() => { onLogPeriod(dateStr); onClose(); }}
                className="btn-fun w-full"
              >
                Mark Period Start 🩸
              </button>
            )}
          </div>
        )}

        {/* Mood Tab */}
        {tab === "mood" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-body">How are you feeling?</p>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => { onLogMood(dateStr, m.emoji, m.label); onClose(); }}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl border-2 transition-all duration-200 hover:scale-110
                    ${existingMood === m.emoji
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-transparent bg-muted/30 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Symptoms Tab */}
        {tab === "symptoms" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-body">Select your symptoms</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-200
                    ${selectedSymptoms.includes(s)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/30"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => { onLogSymptoms(dateStr, selectedSymptoms); onClose(); }}
              className="btn-fun w-full"
            >
              Save Symptoms 💊
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateModal;
