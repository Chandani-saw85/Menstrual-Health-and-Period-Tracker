import { useState, useMemo } from "react";
import AppNavbar from "@/components/AppNavbar";
import { generateSampleData, JournalEntry } from "@/lib/cycle-utils";
import { format } from "date-fns";
import { BookHeart, Plus, X, Trash2 } from "lucide-react";

const JournalPage = () => {
  const sample = useMemo(() => generateSampleData(), []);
  const [entries, setEntries] = useState<JournalEntry[]>(sample.journals);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim()) return;
    setEntries((prev) => [
      ...prev,
      { id: Date.now().toString(), date: format(new Date(), "yyyy-MM-dd"), content: content.trim() },
    ]);
    setContent("");
    setIsWriting(false);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const cardStyles = ["fun-card-pink", "fun-card-purple", "fun-card-mint", "fun-card-peach", "fun-card-sky", "fun-card-sunflower"];

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-3xl mb-1">Private Journal 📝</h2>
            <p className="text-muted-foreground font-body text-sm">Your safe space to write & reflect</p>
          </div>
          <button onClick={() => setIsWriting(!isWriting)} className="btn-fun flex items-center gap-2 py-2.5 px-5 text-sm">
            {isWriting ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isWriting ? "Cancel" : "New Entry"}
          </button>
        </div>

        {isWriting && (
          <div className="fun-card border-primary/20 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <BookHeart className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">What's on your mind? 💭</h3>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, feelings, experiences..."
              className="w-full p-4 rounded-2xl bg-muted border-2 border-border text-sm text-foreground font-body placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary transition-colors min-h-[120px]"
              rows={5}
            />
            <button onClick={handleSave} className="btn-fun mt-3 text-sm py-2.5 px-6">Save Entry 💖</button>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="fun-card text-center py-12">
            <span className="text-5xl mb-4 block">📖</span>
            <p className="font-display text-xl font-bold text-foreground mb-2">No entries yet</p>
            <p className="text-muted-foreground font-body text-sm">Start writing to capture your thoughts & feelings!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...entries].reverse().map((entry, i) => (
              <div key={entry.id} className={`${cardStyles[i % cardStyles.length]} relative group animate-slide-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-2">
                      📅 {format(new Date(entry.date), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-foreground font-body leading-relaxed">{entry.content}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JournalPage;
