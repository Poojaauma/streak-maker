import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, tagColors, tagEmojis, getAISuggestions } from "@/lib/dummy-data";
import { Send, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function LogEntry() {
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [logged, setLogged] = useState(false);
  const suggestions = getAISuggestions();

  const tags: Tag[] = ["work", "health", "learning", "personal"];

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const queryClient = useQueryClient();

  const logMutation = useMutation({
    mutationFn: (newEntry: any) => api.post("/entries", newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["streak"] });
      setLogged(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"],
      });

      setTimeout(() => {
        setContent("");
        setSelectedTags([]);
        setLogged(false);
      }, 2500);
    }
  });

  const handleSubmit = useCallback(() => {
    if (!content.trim()) return;
    logMutation.mutate({ content, tags: selectedTags, date: new Date().toISOString().split('T')[0] });
  }, [content, selectedTags, logMutation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-card border border-border p-5"
    >
      <AnimatePresence mode="wait">
        {logged ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center py-6 gap-2"
          >
            <span className="text-4xl">🎉</span>
            <span className="text-lg font-bold text-primary">Streak maintained!</span>
            <span className="text-sm text-muted-foreground">Nice work, keep it going</span>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                What did you do today?
              </h2>
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/10 active:scale-95"
              >
                <Sparkles className="h-3 w-3" />
                {showSuggestions ? "Hide" : "Ideas"}
              </button>
            </div>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-3"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setContent(s); setShowSuggestions(false); }}
                        className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="I read for 15 minutes..."
              rows={2}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
            />

            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1.5">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-all active:scale-95 ${
                      selectedTags.includes(tag)
                        ? tagColors[tag]
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tagEmojis[tag]} {tag}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110 disabled:opacity-30 disabled:hover:brightness-100 transition-all active:scale-95"
              >
                <Send className="h-3.5 w-3.5" />
                Log
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
