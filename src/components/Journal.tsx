import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { JournalEntry } from "@/lib/cycle-utils";
import { BookHeart, Plus, X } from "lucide-react";

interface Props {
  entries: JournalEntry[];
  onAdd: (entry: JournalEntry) => void;
}

const Journal = ({ entries, onAdd }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onAdd({
      id: Date.now().toString(),
      date: format(new Date(), "yyyy-MM-dd"),
      content: content.trim(),
    });
    setContent("");
    setIsOpen(false);
  };

  return (
    <motion.div
      className="glass-card-elevated p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookHeart className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Private Journal</h3>
        </div>
        <motion.button
          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="How are you feeling today? Write your thoughts..."
              className="w-full p-3 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              className="btn-gradient mt-2 text-sm py-2 px-6"
            >
              Save Entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No journal entries yet. Start writing! ✨</p>
        ) : (
          entries.slice(-3).reverse().map((entry) => (
            <motion.div
              key={entry.id}
              className="p-3 rounded-xl bg-muted/30 border border-border/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-xs text-muted-foreground mb-1">{format(new Date(entry.date), "MMMM d, yyyy")}</p>
              <p className="text-sm text-foreground leading-relaxed">{entry.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Journal;
