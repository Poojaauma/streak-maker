import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { load } from "@cashfreepayments/cashfree-js";
import api from "@/lib/axios";
import { ArrowLeft, User, Crown, Snowflake } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then(res => res.data)
  });

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (orderId) {
      api.post("/payment/verify", { order_id: orderId })
        .then(res => {
          if (res.data.success) {
            toast.success("Successfully upgraded to Premium!");
            queryClient.invalidateQueries({ queryKey: ["me"] });
            queryClient.invalidateQueries({ queryKey: ["streak"] });
          } else {
            toast.error("Payment was not completed.");
          }
        })
        .catch(() => toast.error("Failed to verify payment."))
        .finally(() => {
           searchParams.delete("order_id");
           setSearchParams(searchParams);
        });
    }
  }, [searchParams, setSearchParams, queryClient]);

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      const res = await api.post("/payment/create-order");
      const paymentSessionId = res.data.payment_session_id;

      const cashfree = await load({ mode: "sandbox" });
      cashfree.checkout({
        paymentSessionId: paymentSessionId,
        returnUrl: `http://localhost:8080/profile?order_id={order_id}`
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
      setIsUpgrading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

  const isPremium = user?.subscriptionPlan === "paid";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <span className="font-bold">Profile</span>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
          <div className="mx-auto h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Crown className={`h-5 w-5 ${isPremium ? 'text-amber-400' : 'text-muted-foreground'}`} />
            Subscription Plan
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold uppercase tracking-wider text-primary">
              {isPremium ? "Premium" : "Free"}
            </span>
            {isPremium && (
              <span className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Active
              </span>
            )}
          </div>

          {!isPremium && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm space-y-4">
              <p className="font-medium text-amber-400">Upgrade to Premium to unlock:</p>
              <ul className="space-y-2 text-foreground/80">
                <li>✨ AI Powered Daily Insights</li>
                <li>🎯 Exclusive Milestone Badges</li>
                <li>❄️ Automatic Streak Freezes</li>
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-amber-400 text-amber-950 py-3 rounded-lg font-bold hover:bg-amber-500 transition-colors disabled:opacity-50 mt-4"
              >
                {isUpgrading ? "Starting Checkout..." : "Upgrade for ₹199"}
              </button>
            </div>
          )}

          {isPremium && (
            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm">
              <Snowflake className="h-6 w-6 text-blue-400" />
              <div>
                <p className="font-medium text-blue-400">Sneak Freezes Available</p>
                <p className="text-foreground/80">You have {user?.streakFreezes} freezes remaining.</p>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={logout}
          className="w-full bg-secondary text-foreground hover:bg-secondary/80 py-4 rounded-xl font-bold transition-colors"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}
