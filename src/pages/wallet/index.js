// src/pages/wallet/index.js
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { walletService } from "@/services/wallet.service";
import Link from "next/link";

export default function WalletPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWalletData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadWalletData = async () => {
    try {
      setLoading(true);

      // Fetch transactions and bonuses
      const [transactionsResponse, bonusesResponse] = await Promise.all([
        walletService.getTransactions(1, 20),
        walletService.getBonuses(),
      ]);

      setTransactions(transactionsResponse.transactions);
      setBonuses(bonusesResponse.bonuses);
    } catch (error) {
      console.error("Failed to load wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format transaction type
  const formatTransactionType = (type) => {
    const typeMap = {
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      bet: "Bet",
      win: "Win",
      bonus: "Bonus",
    };

    return typeMap[type] || type;
  };

  // Helper function to format bonus status
  const formatBonusStatus = (status, wageringRemaining) => {
    if (status === "active" && wageringRemaining > 0) {
      return "Wagering Required";
    } else if (status === "active") {
      return "Active";
    } else if (status === "used") {
      return "Used";
    } else {
      return "Expired";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

          {!user ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Please login to access your wallet
                </p>
                <Link href="/auth/login">
                  <Button>Login</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Balance</CardTitle>
                    <CardDescription>
                      Your current account balance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">₹{user.balance}</div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link href="/wallet/deposit" className="flex-1">
                      <Button className="w-full">Deposit</Button>
                    </Link>
                    <Link href="/wallet/withdraw" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Withdraw
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                {/* Active Bonuses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Bonuses</CardTitle>
                    <CardDescription>
                      Your current active bonuses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">Loading...</p>
                      </div>
                    ) : bonuses.length > 0 ? (
                      <div className="space-y-3">
                        {bonuses.map((bonus) => (
                          <div
                            key={bonus.id}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                          >
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">
                                {bonus.description}
                              </div>
                              <div className="text-green-500 font-semibold">
                                ₹{bonus.amount.toFixed(2)}
                              </div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                Expires:{" "}
                                {new Date(bonus.expiresAt).toLocaleDateString()}
                              </span>
                              <span className="text-muted-foreground">
                                {formatBonusStatus(
                                  bonus.status,
                                  bonus.wageringRemaining
                                )}
                              </span>
                            </div>
                            {bonus.wageringRemaining > 0 && (
                              <div className="mt-2 text-xs">
                                <span className="text-muted-foreground">
                                  Wagering remaining: ₹
                                  {bonus.wageringRemaining.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">
                          No active bonuses
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all">
                      <TabsList className="mb-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="deposits">Deposits</TabsTrigger>
                        <TabsTrigger value="withdrawals">
                          Withdrawals
                        </TabsTrigger>
                        <TabsTrigger value="gameplay">Gameplay</TabsTrigger>
                        <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
                      </TabsList>

                      <TabsContent value="all">
                        {renderTransactionsList(
                          transactions,
                          loading,
                          formatTransactionType
                        )}
                      </TabsContent>

                      <TabsContent value="deposits">
                        {renderTransactionsList(
                          transactions.filter((t) => t.type === "deposit"),
                          loading,
                          formatTransactionType
                        )}
                      </TabsContent>

                      <TabsContent value="withdrawals">
                        {renderTransactionsList(
                          transactions.filter((t) => t.type === "withdrawal"),
                          loading,
                          formatTransactionType
                        )}
                      </TabsContent>

                      <TabsContent value="gameplay">
                        {renderTransactionsList(
                          transactions.filter(
                            (t) => t.type === "bet" || t.type === "win"
                          ),
                          loading,
                          formatTransactionType
                        )}
                      </TabsContent>

                      <TabsContent value="bonuses">
                        {renderTransactionsList(
                          transactions.filter((t) => t.type === "bonus"),
                          loading,
                          formatTransactionType
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function renderTransactionsList(transactions, loading, formatTransactionType) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md"
        >
          <div>
            <div className="font-medium">
              {formatTransactionType(transaction.type)}
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
              transaction.amount > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {transaction.amount > 0 ? "+" : ""}₹{transaction.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
