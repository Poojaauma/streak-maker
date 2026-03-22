import { motion } from "framer-motion";
import { getBadges } from "@/lib/dummy-data";

export default function BadgeGrid() {
  const badges = getBadges();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-card border border-border p-5"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Badges
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              badge.earned
                ? "bg-secondary/60"
                : "bg-secondary/20 opacity-40"
            }`}
          >
            <span className="text-2xl">{badge.emoji}</span>
            <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{badge.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
