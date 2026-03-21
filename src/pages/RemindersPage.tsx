import { useState, useMemo } from "react";
import AppNavbar from "@/components/AppNavbar";
import { generateSampleData, predictNextPeriod, Reminder } from "@/lib/cycle-utils";
import { format, addDays, differenceInDays } from "date-fns";
import { Bell, Plus, X, Trash2, Pill, Dumbbell, Droplets } from "lucide-react";

const RemindersPage = () => {
  const sample = useMemo(() => generateSampleData(), []);
  const nextPeriod = predictNextPeriod(sample.cycles);
  const daysUntil = nextPeriod ? Math.max(0, differenceInDays(nextPeriod, new Date())) : null;

  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", type: "period", message: "Period starting soon! Stock up on supplies 🩸", date: nextPeriod ? format(nextPeriod, "yyyy-MM-dd") : "" },
    { id: "2", type: "medicine", message: "Take iron supplement 💊", date: format(new Date(), "yyyy-MM-dd") },
    { id: "3", type: "exercise", message: "Gentle yoga session today 🧘‍♀️", date: format(addDays(new Date(), 1), "yyyy-MM-dd") },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState<"period" | "medicine" | "exercise">("medicine");
  const [newMsg, setNewMsg] = useState("");
  const [newDate, setNewDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleAdd = () => {
    if (!newMsg.trim()) return;
    setReminders((prev) => [...prev, { id: Date.now().toString(), type: newType, message: newMsg.trim(), date: newDate }]);
    setNewMsg("");
    setShowAdd(false);
  };

  const handleDelete = (id: string) => setReminders((prev) => prev.filter((r) => r.id !== id));

  const typeConfig = {
    period: { icon: Droplets, label: "Period", cardClass: "fun-card-pink", badge: "bg-primary/15 text-primary" },
    medicine: { icon: Pill, label: "Medicine", cardClass: "fun-card-purple", badge: "bg-lilac/20 text-secondary-foreground" },
    exercise: { icon: Dumbbell, label: "Exercise", cardClass: "fun-card-mint", badge: "bg-mint/15 text-accent" },
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-3xl mb-1">Reminders 🔔</h2>
            <p className="text-muted-foreground font-body text-sm">Never miss a thing!</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-fun flex items-center gap-2 py-2.5 px-5 text-sm">
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAdd ? "Cancel" : "Add Reminder"}
          </button>
        </div>

        {/* Period Alert */}
        {daysUntil !== null && daysUntil <= 5 && (
          <div className="relative overflow-hidden rounded-3xl p-5 border-2 border-primary/20 animate-gentle-pulse" style={{
            background: "linear-gradient(135deg, hsl(340,80%,92%), hsl(25,90%,93%), hsl(340,80%,95%))",
          }}>
            <div className="flex items-center gap-4">
              <span className="text-4xl animate-wiggle">🩸</span>
              <div>
                <p className="font-display text-lg font-bold text-foreground">
                  {daysUntil === 0 ? "Period expected TODAY!" : `Period in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}!`}
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  {nextPeriod ? `Expected: ${format(nextPeriod, "MMMM d, yyyy")}` : ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add form */}
        {showAdd && (
          <div className="fun-card border-primary/20 animate-slide-up">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">New Reminder ✨</h3>
            <div className="flex gap-2 mb-3">
              {(["period", "medicine", "exercise"] as const).map((t) => {
                const { icon: Icon, label } = typeConfig[t];
                return (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                      newType === t ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                );
              })}
            </div>
            <input
              value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Reminder message..."
              className="w-full p-3 rounded-2xl bg-muted border-2 border-border text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-3"
            />
            <input
              type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-3 rounded-2xl bg-muted border-2 border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors mb-3"
            />
            <button onClick={handleAdd} className="btn-fun text-sm py-2.5 px-6">Save 💖</button>
          </div>
        )}

        {/* Reminders list */}
        <div className="space-y-3">
          {reminders.map((r, i) => {
            const { icon: Icon, label, cardClass, badge } = typeConfig[r.type];
            return (
              <div key={r.id} className={`${cardClass} group relative animate-slide-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center border-2 border-border">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge}`}>{label}</span>
                      <span className="text-xs text-muted-foreground font-body">
                        {r.date ? format(new Date(r.date), "MMM d, yyyy") : ""}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-body">{r.message}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default RemindersPage;
