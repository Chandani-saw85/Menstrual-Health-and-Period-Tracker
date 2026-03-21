import { useState, useMemo } from "react";
import AppNavbar from "@/components/AppNavbar";
import { generateSampleData, MOODS, MoodEntry, SUPPORT_MESSAGES } from "@/lib/cycle-utils";
import { format } from "date-fns";
import { SmilePlus, Heart, RefreshCw, TrendingUp } from "lucide-react";

const moodToValue: Record<string, number> = {
  "😊": 5, "🥰": 5, "💪": 5, "🤗": 5, "😌": 4, "😴": 3, "😵‍💫": 2, "😰": 2, "🤢": 2, "😢": 1, "😤": 1, "😔": 1,
};

const MoodSupport = () => {
  const sample = useMemo(() => generateSampleData(), []);
  const [moods, setMoods] = useState<MoodEntry[]>(sample.moods);
  const [supportMsg, setSupportMsg] = useState(SUPPORT_MESSAGES[0]);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = moods.find((m) => m.date === today);
  const recentMoods = moods.slice(-10);

  const handleMoodSelect = (emoji: string, label: string) => {
    setMoods((prev) => [
      ...prev.filter((m) => m.date !== today),
      { id: Date.now().toString(), date: today, mood: emoji, label },
    ]);
  };

  const refreshSupport = () => {
    const idx = Math.floor(Math.random() * SUPPORT_MESSAGES.length);
    setSupportMsg(SUPPORT_MESSAGES[idx]);
  };

  const maxVal = 5;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="section-title text-3xl mb-1">Mood & Support 💕</h2>
          <p className="text-muted-foreground font-body text-sm">Track your emotions & find comfort</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood Selector */}
          <div className="fun-card-pink">
            <div className="flex items-center gap-2 mb-4">
              <SmilePlus className="w-5 h-5 text-primary" />
              <h3 className="font-display text-xl font-bold text-foreground">How are you feeling today?</h3>
            </div>

            {todayMood ? (
              <div className="text-center py-6">
                <span className="text-6xl block mb-2 animate-wiggle">{todayMood.mood}</span>
                <p className="font-display text-xl font-bold text-foreground">{todayMood.label}</p>
                <p className="text-sm text-muted-foreground font-body mt-1">Logged for today ✨</p>
                <button
                  onClick={() => setMoods((prev) => prev.filter((m) => m.date !== today))}
                  className="text-xs text-primary hover:underline mt-3"
                >
                  Change mood
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {MOODS.map(({ emoji, label, color }) => (
                  <button
                    key={emoji}
                    onClick={() => handleMoodSelect(emoji, label)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <span className="text-3xl">{emoji}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <div className="fun-card-sunflower relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-coral animate-heartbeat" />
                  <h3 className="font-display text-lg font-bold text-foreground">Daily Motivation</h3>
                </div>
                <button
                  onClick={refreshSupport}
                  className="w-8 h-8 rounded-full bg-sunflower/20 flex items-center justify-center hover:bg-sunflower/30 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <p className="text-lg font-body text-foreground leading-relaxed">{supportMsg}</p>
            </div>

            {/* Quick Resources */}
            <div className="fun-card-purple">
              <h3 className="font-display text-lg font-bold text-foreground mb-3">💜 Self-Care Ideas</h3>
              <div className="grid grid-cols-2 gap-2">
                {["🛁 Warm bath", "📖 Read a book", "🎵 Calming music", "🍵 Herbal tea", "🧘 Meditation", "🎨 Creative time"].map((item) => (
                  <div key={item} className="flex items-center gap-2 p-2.5 rounded-xl bg-card/50 text-sm text-foreground font-body border border-border/50">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mood Chart */}
        <div className="fun-card border-primary/20">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-display text-xl font-bold text-foreground">Mood Trends 📊</h3>
          </div>
          {recentMoods.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 font-body">Log moods to see your trends</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {recentMoods.map((m, i) => {
                const val = moodToValue[m.mood] || 3;
                const height = (val / maxVal) * 100;
                const colors = [
                  "from-primary to-bubblegum",
                  "from-secondary to-lilac",
                  "from-coral to-sunflower",
                  "from-mint to-seafoam",
                  "from-sky to-secondary",
                ];
                return (
                  <div key={m.id} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-sm">{m.mood}</span>
                    <div
                      className={`w-full rounded-t-xl bg-gradient-to-t ${colors[i % colors.length]} transition-all duration-500`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[9px] font-bold text-muted-foreground">
                      {format(new Date(m.date), "d")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MoodSupport;
