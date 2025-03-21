// src/pages/games/slots.js
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SlotsGame } from "@/components/games/SlotsGame";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { gamesService } from "@/services/games.service";

export default function SlotsPage() {
  const { user } = useAuth();
  const [betHistory, setBetHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBetHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadBetHistory = async () => {
    try {
      setLoading(true);
      const response = await gamesService.getBetHistory(1, 10, "slots");
      setBetHistory(response.bets);
    } catch (error) {
      console.error("Failed to load bet history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Slots Machine</h1>
            <p className="text-muted-foreground">
              Spin the reels and match symbols to win big prizes!
            </p>
          </div>

          <SlotsGame onBetPlaced={loadBetHistory} />

          {user && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Your Slots History</CardTitle>
                  <CardDescription>Your recent spins</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  ) : betHistory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {betHistory.map((bet) => (
                        <div
                          key={bet.id}
                          className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                        >
                          <div>
                            <div className="font-medium">{bet.outcome}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(bet.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div
                            className={`font-semibold ${
                              bet.status === "won"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {bet.status === "won"
                              ? `+₹${bet.payout}`
                              : `-₹${bet.amount}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        No slots history yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
