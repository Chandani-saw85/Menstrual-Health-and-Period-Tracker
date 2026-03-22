import { getCyclePhase, CycleEntry } from "@/lib/cycle-utils";

const INSIGHTS_MAP: Record<string, string[]> = {
  Menstrual: [
    "💧 Drink more water today — hydration helps with cramps",
    "🧘‍♀️ Gentle yoga or stretching recommended",
    "🍫 Dark chocolate is actually good for you right now!",
    "😴 Prioritize sleep — your body is working hard",
    "🍵 Try ginger or chamomile tea for comfort",
  ],
  Follicular: [
    "🏃‍♀️ Great time for cardio and high-energy workouts!",
    "🥗 Load up on fresh, light foods",
    "🎨 Your creativity peaks — start new projects!",
    "💪 Strength training is most effective now",
    "🍊 Vitamin C-rich foods boost your energy",
  ],
  Ovulation: [
    "✨ You're at peak energy — tackle big tasks!",
    "💃 Perfect time for social events & presentations",
    "🥑 Eat anti-inflammatory foods like avocado & berries",
    "🏋️ Push your workout limits — you can handle it!",
    "🌟 Your skin is glowing — enjoy it!",
  ],
  Luteal: [
    "🧘‍♀️ Light yoga recommended — honor your body",
    "🍠 Complex carbs like sweet potato help with cravings",
    "😌 Practice meditation for mood balance",
    "🥜 Magnesium-rich nuts can ease PMS symptoms",
    "🛁 A warm bath can help with tension",
  ],
  Unknown: [
    "📊 Start tracking your cycle for personalized insights!",
    "💧 Stay hydrated throughout the day",
    "🧘‍♀️ Regular exercise helps menstrual health",
  ],
};

interface SmartInsightsProps {
  cycles: CycleEntry[];
}

const SmartInsights = ({ cycles }: SmartInsightsProps) => {
  const { phase } = getCyclePhase(cycles);
  const tips = INSIGHTS_MAP[phase] || INSIGHTS_MAP.Unknown;

  return (
    <div className="fun-card border-sky/20"
      style={{ background: "linear-gradient(135deg, hsl(200,80%,94%), hsl(210,70%,96%))" }}
    >
      <h3 className="font-display text-lg font-bold text-foreground mb-3">🧠 Smart Insights</h3>
      <p className="text-xs text-muted-foreground mb-3 font-body">AI-powered tips for your {phase} phase</p>
      <div className="space-y-2">
        {tips.slice(0, 4).map((tip, i) => (
          <div
            key={i}
            className="flex items-start gap-2 p-2.5 rounded-2xl bg-card/60 border border-border/50 text-sm text-foreground font-body
              hover:bg-card hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default"
          >
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartInsights;
