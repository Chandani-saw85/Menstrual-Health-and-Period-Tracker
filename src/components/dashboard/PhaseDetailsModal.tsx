import { getCyclePhase } from "@/lib/cycle-utils";
import { CycleEntry } from "@/lib/cycle-utils";
import { X } from "lucide-react";

const PHASES = [
  {
    name: "Menstrual",
    icon: "🩸",
    days: "Day 1–5",
    color: "from-primary/20 to-bubblegum/20",
    border: "border-primary/30",
    description: "Your uterine lining sheds. Hormone levels are at their lowest.",
    hormones: "Estrogen & Progesterone at lowest levels",
    emotional: "May feel introspective, tired, or emotional",
    physical: "Cramps, bloating, lower back pain, fatigue",
    tips: ["Rest and gentle movement", "Stay hydrated", "Use heat packs for cramps", "Iron-rich foods: spinach, lentils"],
    diet: ["Dark chocolate 🍫", "Warm soups 🍲", "Herbal teas 🍵", "Bananas 🍌", "Iron-rich greens 🥬"],
  },
  {
    name: "Follicular",
    icon: "🌱",
    days: "Day 6–13",
    color: "from-mint/20 to-seafoam/20",
    border: "border-mint/30",
    description: "Your body prepares for ovulation. Energy begins rising.",
    hormones: "Estrogen rising steadily, FSH increases",
    emotional: "Increasing energy, creativity, and optimism",
    physical: "Skin clears up, energy increases",
    tips: ["Try new workouts", "Start creative projects", "Socialize more", "Eat light, fresh foods"],
    diet: ["Fresh salads 🥗", "Smoothies 🥤", "Fermented foods 🧄", "Lean protein 🍗", "Citrus fruits 🍊"],
  },
  {
    name: "Ovulation",
    icon: "🌸",
    days: "Day 14–16",
    color: "from-sunflower/20 to-coral/20",
    border: "border-sunflower/30",
    description: "An egg is released. Peak fertility and energy.",
    hormones: "Estrogen peaks, LH surges, testosterone rises",
    emotional: "Peak confidence, sociability, and attractiveness",
    physical: "Mild cramping, increased libido, glowing skin",
    tips: ["High-intensity workouts", "Important presentations", "Date nights", "Stay active"],
    diet: ["Berries 🍓", "Turmeric 🟡", "Fiber-rich veggies 🥦", "Healthy fats 🥑", "Light meals 🍽️"],
  },
  {
    name: "Luteal",
    icon: "🌙",
    days: "Day 17–28",
    color: "from-lilac/20 to-secondary/20",
    border: "border-lilac/30",
    description: "Body prepares for potential pregnancy. PMS symptoms may appear.",
    hormones: "Progesterone rises then drops, estrogen dips",
    emotional: "Mood swings, irritability, anxiety possible",
    physical: "Bloating, breast tenderness, cravings, fatigue",
    tips: ["Prioritize sleep", "Gentle yoga & pilates", "Reduce caffeine", "Self-care rituals"],
    diet: ["Sweet potato 🍠", "Dark chocolate 🍫", "Magnesium-rich nuts 🥜", "Chamomile tea 🍵", "Whole grains 🌾"],
  },
];

interface PhaseDetailsModalProps {
  onClose: () => void;
  cycles: CycleEntry[];
  initialPhase?: string;
}

const PhaseDetailsModal = ({ onClose, cycles, initialPhase }: PhaseDetailsModalProps) => {
  const current = getCyclePhase(cycles);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-up"
        style={{
          background: "linear-gradient(135deg, hsla(0,0%,100%,0.97), hsla(340,60%,98%,0.97))",
          backdropFilter: "blur(20px)",
          borderRadius: "2rem",
          border: "2px solid hsl(var(--border))",
          boxShadow: "0 25px 60px -12px hsla(340,75%,55%,0.2)",
          padding: "1.5rem",
        }}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-2xl font-bold text-foreground">🔬 Cycle Phases</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {PHASES.map((phase) => {
            const isActive = current.phase === phase.name;
            return (
              <div
                key={phase.name}
                className={`rounded-3xl p-5 border-2 transition-all duration-300 bg-gradient-to-br ${phase.color} ${phase.border}
                  ${isActive ? "ring-2 ring-primary/30 shadow-lg" : ""}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{phase.icon}</span>
                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                      {phase.name}
                      {isActive && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-body">
                          Current Phase
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground font-body">{phase.days}</p>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 font-body mb-3">{phase.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-card/60 rounded-2xl p-3">
                    <p className="font-bold text-foreground mb-1">🧬 Hormones</p>
                    <p className="text-muted-foreground">{phase.hormones}</p>
                  </div>
                  <div className="bg-card/60 rounded-2xl p-3">
                    <p className="font-bold text-foreground mb-1">💭 Emotional</p>
                    <p className="text-muted-foreground">{phase.emotional}</p>
                  </div>
                  <div className="bg-card/60 rounded-2xl p-3">
                    <p className="font-bold text-foreground mb-1">🏋️ Physical</p>
                    <p className="text-muted-foreground">{phase.physical}</p>
                  </div>
                  <div className="bg-card/60 rounded-2xl p-3">
                    <p className="font-bold text-foreground mb-1">💡 Tips</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      {phase.tips.map((t) => <li key={t}>• {t}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 bg-card/60 rounded-2xl p-3">
                  <p className="font-bold text-foreground text-xs mb-1">🥗 Diet Suggestions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.diet.map((d) => (
                      <span key={d} className="px-2 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhaseDetailsModal;
