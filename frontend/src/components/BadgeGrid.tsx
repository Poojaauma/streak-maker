import { motion } from "framer-motion";
import { getBadges } from "@/lib/dummy-data";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/lib/axios";
import { Lock } from "lucide-react";

export default function BadgeGrid() {
  const badges = getBadges();
  
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then(res => res.data)
  });
  
  const isPremium = user?.subscriptionPlan === "paid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-5"
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
      
      {!isPremium && (
        <div className="absolute inset-0 backdrop-blur-sm bg-background/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center border-2 border-amber-500/20 z-10">
          <Lock className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="font-bold text-foreground">Premium Feature</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Upgrade to unlock milestone tracking and custom badges.</p>
          <Link to="/profile" className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold px-5 py-2 rounded-lg text-sm transition-colors">
            Unlock Badges
          </Link>
        </div>
      )}
    </motion.div>
  );
}
