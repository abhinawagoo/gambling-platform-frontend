// src/pages/games/roulette.js
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RouletteGame } from "@/components/games/RouletteGame";
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

export default function RoulettePage() {
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
      const response = await gamesService.getBetHistory(1, 10, "roulette");
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
            <h1 className="text-3xl font-bold">Roulette</h1>
            <p className="text-muted-foreground">
              The classic casino game. Place your bets and watch the wheel spin.
            </p>
          </div>

          <RouletteGame onBetPlaced={loadBetHistory} />

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Roulette Payouts</CardTitle>
                <CardDescription>
                  Different bet types offer different odds and payouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Inside Bets</h3>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <strong>Straight (single number):</strong> 35:1
                      </li>
                      <li>
                        <strong>Green (0):</strong> 35:1
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Outside Bets</h3>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <strong>Red/Black:</strong> 1.95:1
                      </li>
                      <li>
                        <strong>Even/Odd:</strong> 1.95:1
                      </li>
                      <li>
                        <strong>High (19-36)/Low (1-18):</strong> 1.95:1
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {user && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Roulette History</CardTitle>
                  <CardDescription>Your recent roulette bets</CardDescription>
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
                        No roulette bets yet.
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
