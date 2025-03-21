// src/components/games/SlotsGame.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { gamesService } from "@/services/games.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function SlotsGame({ onBetPlaced }) {
    const { user, refreshBalance } = useAuth();
    const [amount, setAmount] = useState(10);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [displayedReels, setDisplayedReels] = useState(["?", "?", "?"]);

    // Predefined bet amounts
    const betAmounts = [10, 20, 50, 100, 500];

    // Slot symbols with their multipliers
    const symbols = [
        { symbol: "🍒", name: "Cherry", multiplier: 5 },
        { symbol: "🍋", name: "Lemon", multiplier: 10 },
        { symbol: "🍊", name: "Orange", multiplier: 15 },
        { symbol: "🍇", name: "Grapes", multiplier: 25 },
        { symbol: "💎", name: "Diamond", multiplier: 50 },
        { symbol: "7️⃣", name: "Seven", multiplier: 100 }
    ];

    const placeBet = async () => {
        if (!user) {
            toast.error("Authentication required", {
                description: "Please login to place bets",
            });
            return;
        }

        if (user.balance < amount) {
            toast.error("Insufficient balance", {
                description: "Please deposit funds to continue playing",
            });
            return;
        }

        try {
            setIsSpinning(true);

            // Animate the reels while waiting for the result
            let spinInterval = setInterval(() => {
                setDisplayedReels(displayedReels.map(() => {
                    return symbols[Math.floor(Math.random() * symbols.length)].symbol;
                }));
            }, 100);

            const response = await gamesService.placeBet({
                gameType: "slots",
                amount,
                betDetails: {}
            });

            // Continue spinning for a while after receiving the result
            setTimeout(() => {
                clearInterval(spinInterval);
                setIsSpinning(false);
                setResult(response.gameDetails);
                setDisplayedReels(response.gameDetails.reels);
                refreshBalance();

                // Show result notification
                if (response.gameDetails.won) {
                    toast.success("You won!", {
                        description: `You've won ₹${response.bet.payout.toFixed(2)}!`,
                    });
                } else {
                    toast.error("No win this time", {
                        description: "Try again for a chance to win!",
                    });
                }

                if (onBetPlaced) onBetPlaced();
            }, 2000);
        } catch (error) {
            setIsSpinning(false);
            toast.error("Error placing bet", {
                description: error.response?.data?.message || "Failed to place bet",
            });
        }
    };

    // Find the payout multiplier for a symbol
    const getMultiplier = (symbol) => {
        const found = symbols.find(s => s.symbol === symbol);
        return found ? found.multiplier : 0;
    };

    return (
        <div className="grid md:grid-cols-1 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Slots Machine</CardTitle>
                    <CardDescription>Spin the reels and match symbols to win!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Slot machine display */}
                    <div className="relative bg-gray-900 rounded-lg p-4 border-4 border-yellow-600">
                        <div className="flex justify-center items-center h-48 mb-4">
                            {displayedReels.map((symbol, index) => (
                                <motion.div
                                    key={index}
                                    className="w-1/3 h-full mx-1 bg-white rounded-md flex items-center justify-center shadow-inner border-2 border-gray-300"
                                    animate={isSpinning ? {
                                        y: [0, -20, 0, -20, 0],
                                        scale: [1, 1.05, 1, 1.05, 1]
                                    } : {}}
                                    transition={isSpinning ? {
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        delay: index * 0.1
                                    } : {}}
                                >
                                    <span className="text-6xl">{symbol}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Win line */}
                        {result && result.won && (
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-yellow-400 animate-pulse"></div>
                        )}

                        {/* Win display */}
                        {result && result.won && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black font-bold px-4 py-1 rounded-full animate-bounce">
                                WIN! +₹{result.payout.toFixed(2)}
                            </div>
                        )}
                    </div>

                    {/* Paytable */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Paytable</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            {symbols.map((item) => (
                                <div key={item.symbol} className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-700">
                                    <span className="text-2xl mr-2">{item.symbol}</span>
                                    <span className="text-muted-foreground">{item.multiplier}x</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Three matching symbols pay the multiplier shown. Two adjacent matching symbols pay 1.5x.
                        </p>
                    </div>

                    {/* Bet amount */}
                    <div className="space-y-3">
                        <Label>Bet amount:</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {betAmounts.map((value) => (
                                <Button
                                    key={value}
                                    type="button"
                                    variant={amount === value ? "default" : "outline"}
                                    onClick={() => setAmount(value)}
                                >
                                    ₹{value}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Spin button */}
                    <Button
                        onClick={placeBet}
                        disabled={isSpinning || !user}
                        className="w-full bg-red-600 hover:bg-red-700"
                        size="lg"
                    >
                        {isSpinning ? "Spinning..." : "SPIN"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}