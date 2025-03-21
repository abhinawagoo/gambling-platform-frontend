// src/pages/games/dice.js
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DiceRollGame } from "@/components/games/DiceRollGame";
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

export default function DiceRollPage() {
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
      const response = await gamesService.getBetHistory(1, 10, "diceRoll");
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
            <h1 className="text-3xl font-bold">Dice Roll</h1>
            <p className="text-muted-foreground">
              Roll the dice and bet on the outcome. Choose between high, low, or
              an exact number.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DiceRollGame onBetPlaced={loadBetHistory} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Game Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>High (4-6):</strong> Win if dice shows 4, 5, or 6.
                      Payout: 1.95x
                    </li>
                    <li>
                      <strong>Low (1-3):</strong> Win if dice shows 1, 2, or 3.
                      Payout: 1.95x
                    </li>
                    <li>
                      <strong>Exact Number:</strong> Win if dice shows your
                      chosen number. Payout: 5.85x
                    </li>
                    <li>Minimum bet: ₹10</li>
                    <li>Maximum bet: ₹10,000</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Bet history */}
              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your History</CardTitle>
                    <CardDescription>
                      Your recent dice roll bets
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
