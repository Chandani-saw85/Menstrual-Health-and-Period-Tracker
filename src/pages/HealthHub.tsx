import { useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import { DIET_TIPS, EXERCISE_TIPS, MEDICINE_INFO, getCyclePhase, generateSampleData } from "@/lib/cycle-utils";
import { Salad, Dumbbell, Pill, Leaf, ChevronRight } from "lucide-react";

const HealthHub = () => {
  const [tab, setTab] = useState<"diet" | "exercise" | "medicine">("diet");
  const { cycles } = generateSampleData();
  const { phase } = getCyclePhase(cycles);

  const tabs = [
    { id: "diet" as const, label: "Diet 🥗", icon: Salad, color: "text-mint" },
    { id: "exercise" as const, label: "Exercise 💪", icon: Dumbbell, color: "text-coral" },
    { id: "medicine" as const, label: "Medicine 💊", icon: Pill, color: "text-lilac" },
  ];

  const cardColors = ["fun-card-pink", "fun-card-mint", "fun-card-peach", "fun-card-purple"];

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="section-title text-3xl mb-1">Health Hub 🌿</h2>
          <p className="text-muted-foreground font-body text-sm">
            Phase-based guidance for your body & mind • Currently: <strong>{phase}</strong> phase
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 border-2 ${
                tab === t.id
                  ? "bg-primary/10 border-primary/30 text-primary shadow-md"
                  : "bg-card border-border text-muted-foreground hover:border-primary/20"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Diet */}
        {tab === "diet" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
            {DIET_TIPS.map((d, i) => (
              <div key={d.phase} className={`${cardColors[i]} relative overflow-hidden`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{d.icon}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{d.phase} Phase</h3>
                    <p className="text-xs text-muted-foreground font-body">Recommended foods</p>
                  </div>
                  {d.phase === phase && (
                    <span className="ml-auto px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold animate-gentle-pulse">
                      Current ✨
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {d.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-foreground font-body">
                      <Leaf className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Exercise */}
        {tab === "exercise" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
            {EXERCISE_TIPS.map((e, i) => (
              <div key={e.phase} className={`${cardColors[i]} relative overflow-hidden`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{e.icon}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{e.phase} Phase</h3>
                    <p className="text-xs text-muted-foreground font-body">Recommended activities</p>
                  </div>
                  {e.phase === phase && (
                    <span className="ml-auto px-3 py-1 rounded-full bg-coral/15 text-coral text-xs font-bold animate-gentle-pulse">
                      Current 🔥
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {e.exercises.map((ex) => (
                    <li key={ex} className="flex items-center gap-2 text-sm text-foreground font-body">
                      <ChevronRight className="w-4 h-4 text-coral flex-shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Medicine */}
        {tab === "medicine" && (
          <div className="space-y-4 animate-slide-up">
            <div className="fun-card-sky p-4">
              <p className="text-sm text-foreground font-body flex items-center gap-2">
                ⚠️ <strong>Disclaimer:</strong> These are general suggestions. Always consult a healthcare professional before taking any medication.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MEDICINE_INFO.map((m) => (
                <div key={m.name} className="fun-card hover:border-lilac/40">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{m.icon}</span>
                    <h3 className="font-display text-base font-bold text-foreground">{m.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-body">{m.desc}</p>
                  {m.safe && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-mint/15 text-mint text-xs font-bold">
                      Generally Safe ✅
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthHub;
