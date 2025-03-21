// src/pages/dashboard/index.js
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { gamesService } from "@/services/games.service";
import { walletService } from "@/services/wallet.service";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bets, setBets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWagered: 0,
    totalWon: 0,
    winRate: 0,
    biggestWin: 0,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      router.push("/auth/login?redirect=/dashboard");
    } else if (user) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load bets, transactions, and bonuses
      const [betsResponse, transactionsResponse, bonusesResponse] =
        await Promise.all([
          gamesService.getBetHistory(1, 10),
          walletService.getTransactions(1, 10),
          walletService.getBonuses(),
        ]);

      setBets(betsResponse.bets);
      setTransactions(transactionsResponse.transactions);
      setBonuses(bonusesResponse.bonuses);

      // Calculate stats
      const allBets = betsResponse.bets;
      const totalWagered = allBets.reduce((sum, bet) => sum + bet.amount, 0);
      const wins = allBets.filter((bet) => bet.status === "won");
      const totalWon = wins.reduce((sum, bet) => sum + bet.payout, 0);
      const winRate =
        allBets.length > 0 ? (wins.length / allBets.length) * 100 : 0;
      const biggestWin =
        wins.length > 0 ? Math.max(...wins.map((bet) => bet.payout)) : 0;

      setStats({
        totalWagered,
        totalWon,
        winRate,
        biggestWin,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    // Get the last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    // Format dates and filter bets by date
    return dates.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dayBets = bets.filter((bet) => {
        const betDate = new Date(bet.createdAt).toISOString().split("T")[0];
        return betDate === dateStr;
      });

      const wagered = dayBets.reduce((sum, bet) => sum + bet.amount, 0);
      const won = dayBets
        .filter((bet) => bet.status === "won")
        .reduce((sum, bet) => sum + bet.payout, 0);

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        wagered,
        won,
      };
    });
  };

  if (!user) {
    return null; // Don't render anything until redirect happens
  }

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{Number(user.balance).toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Wagered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{Number(stats.totalWagered).toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Won
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  ₹{Number(stats.totalWon).toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Win Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Number(stats.winRate).toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Betting Activity</CardTitle>
                <CardDescription>
                  Your gambling activity over the past 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Loading chart...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="wagered"
                          stroke="#8884d8"
                          name="Wagered"
                        />
                        <Line
                          type="monotone"
                          dataKey="won"
                          stroke="#82ca9d"
                          name="Won"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks you might want to perform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/wallet/deposit">
                  <Button className="w-full">Deposit Funds</Button>
                </Link>
                <Link href="/wallet/withdraw">
                  <Button variant="outline" className="w-full">
                    Withdraw Funds
                  </Button>
                </Link>
                <Link href="/games">
                  <Button variant="outline" className="w-full">
                    Play Games
                  </Button>
                </Link>
                <Link href="/history">
                  <Button variant="outline" className="w-full">
                    View Bet History
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bets</CardTitle>
                <CardDescription>Your most recent bets</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                ) : bets.length > 0 ? (
                  <div className="space-y-2">
                    {bets.slice(0, 5).map((bet) => (
                      <div
                        key={bet.id}
                        className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        <div>
                          <div className="font-medium capitalize">
                            {bet.gameType}
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
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No bets yet</p>
                    <Link href="/games">
                      <Button variant="link">Start playing now</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
              {bets.length > 0 && (
                <CardFooter>
                  <Link href="/history" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Bets
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your most recent financial transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        <div>
                          <div className="font-medium capitalize">
                            {transaction.type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div
                          className={`font-semibold ${
                            transaction.amount > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}₹
                          {Number(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                )}
              </CardContent>
              {transactions.length > 0 && (
                <CardFooter>
                  <Link href="/wallet" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
