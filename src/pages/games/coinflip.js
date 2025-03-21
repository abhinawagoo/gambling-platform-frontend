// src/pages/games/coinflip.js
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CoinFlipGame } from "@/components/games/CoinFlipGame";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { gamesService } from "@/services/games.service";

export default function CoinFlipPage() {
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
      const response = await gamesService.getBetHistory(1, 10, "coinFlip");
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
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Coin Flip</h1>
            <p className="text-muted-foreground">
              A simple game of chance. Choose heads or tails and place your bet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CoinFlipGame onBetPlaced={loadBetHistory} />
            </div>

            <div className="space-y-6">
              {/* Game rules */}
              <Card>
                <CardHeader>
                  <CardTitle>Game Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>Choose heads or tails and place your bet</li>
                    <li>
                      If the coin lands on your chosen side, you win 1.95x your
                      bet
                    </li>
                    <li>Minimum bet: ₹10</li>
                    <li>Maximum bet: ₹10,000</li>
                    <li>Fair game with 50% win probability</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Bet history */}
              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your History</CardTitle>
                    <CardDescription>
                      Your recent coin flip bets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">Loading...</p>
                      </div>
                    ) : betHistory.length > 0 ? (
                      <div className="space-y-2">
                        {betHistory.map((bet) => (
                          <div
                            key={bet.id}
                            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                          >
                            <div>
                              <div className="font-medium">
                                {bet.betDetails.choice ===
                                bet.outcome.toLowerCase()
                                  ? "Won"
                                  : "Lost"}
                              </div>
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
                          No bet history yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
