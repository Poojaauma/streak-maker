import { motion } from "framer-motion";
import { tagColors, tagEmojis } from "@/lib/dummy-data";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function RecentEntries() {
  const { data: entriesData } = useQuery({
    queryKey: ["entries"],
    queryFn: () => api.get("/entries").then(res => res.data)
  });
  
  const entries = (entriesData || []).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-card border border-border p-5"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Recent Entries
      </h3>
      <div className="space-y-3">
        {entries.map((entry: any, i: number) => (
          <motion.div
            key={entry._id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
            className="flex gap-3 items-start group"
          >
            <div className="mt-1.5 h-2 w-2 rounded-full bg-success flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground/90 leading-relaxed">{entry.content}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-muted-foreground">
                  {format(parseISO(entry.date), "MMM d")}
                </span>
                {entry.tags.map((tag: any) => (
                  <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full ${tagColors[tag as keyof typeof tagColors]}`}>
                    {tagEmojis[tag as keyof typeof tagEmojis]} {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
