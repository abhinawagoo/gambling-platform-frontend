// src/pages/history.js
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { gamesService } from "@/services/games.service";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    gameType: "",
    status: "",
    page: 1,
  });
  const [totalBets, setTotalBets] = useState(0);
  const limit = 10;

  // Redirect if not logged in
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      router.push("/auth/login?redirect=/history");
    } else if (user) {
      loadBets();
    } else {
      setLoading(false);
    }
  }, [user, router, filter]);

  const loadBets = async () => {
    try {
      setLoading(true);
      const response = await gamesService.getBetHistory(
        filter.page,
        limit,
        filter.gameType || undefined,
        filter.status || undefined
      );
      setBets(response.bets);
      setTotalBets(response.total);
    } catch (error) {
      console.error("Failed to load bets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };

  const totalPages = Math.ceil(totalBets / limit);

  if (!user) {
    return null; // Don't render anything until redirect happens
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Bet History</h1>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Your Bets</CardTitle>
                  <CardDescription>
                    Review all of your past bets
                  </CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filter.gameType}
                    onValueChange={(value) =>
                      setFilter({ ...filter, gameType: value, page: 1 })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All games" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All games</SelectItem>
                      <SelectItem value="coinFlip">Coin Flip</SelectItem>
                      <SelectItem value="diceRoll">Dice Roll</SelectItem>
                      <SelectItem value="roulette">Roulette</SelectItem>
                      <SelectItem value="slots">Slots</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filter.status}
                    onValueChange={(value) =>
                      setFilter({ ...filter, status: value, page: 1 })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All outcomes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All outcomes</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Loading bet history...
                  </p>
                </div>
              ) : bets.length > 0 ? (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-sm font-medium">
                            Game
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Date
                          </th>
                          <th className="text-right p-3 text-sm font-medium">
                            Amount
                          </th>
                          <th className="text-right p-3 text-sm font-medium">
                            Outcome
                          </th>
                          <th className="text-right p-3 text-sm font-medium">
                            Payout
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bets.map((bet) => (
                          <tr
                            key={bet.id}
                            className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="p-3">
                              <div className="font-medium capitalize">
                                {bet.gameType}
                              </div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {JSON.stringify(bet.betDetails)}
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              {new Date(bet.createdAt).toLocaleString()}
                            </td>
                            <td className="p-3 text-right">
                              ₹{bet.amount.toFixed(2)}
                            </td>
                            <td className="p-3 text-right">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                  bet.status === "won"
                                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                    : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                                }`}
                              >
                                {bet.status === "won" ? "Won" : "Lost"}
                              </span>
                            </td>
                            <td className="p-3 text-right font-medium">
                              {bet.status === "won"
                                ? `₹${bet.payout.toFixed(2)}`
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(Math.max(1, filter.page - 1))
                          }
                          disabled={filter.page === 1}
                        >
                          Previous
                        </Button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              filter.page === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(
                              Math.min(totalPages, filter.page + 1)
                            )
                          }
                          disabled={filter.page === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    {/* You haven't placed any bets yet. */}
                  </p>
                  <Link href="/games">
                    <Button>Start Playing</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
