// src/components/games/CoinFlipGame.jsx
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { gamesService } from "@/services/games.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function CoinFlipGame({ onBetPlaced }) {
    const { user, refreshBalance } = useAuth();
    const [choice, setChoice] = useState("heads");
    const [amount, setAmount] = useState(10);
    const [isFlipping, setIsFlipping] = useState(false);
    const [result, setResult] = useState(null);

    // Predefined bet amounts
    const betAmounts = [10, 20, 50, 100, 500];

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
            setIsFlipping(true);

            const response = await gamesService.placeBet({
                gameType: "coinFlip",
                amount,
                betDetails: { choice }
            });

            // Simulate coin flip animation
            setTimeout(() => {
                setResult(response.gameDetails);
                setIsFlipping(false);
                refreshBalance();

                // Show result notification
                if (response.gameDetails.won) {
                    toast.success("You won!", {
                        description: `You've won ₹${response.bet.payout.toFixed(2)}!`,
                    });
                } else {
                    toast.error("You lost", {
                        description: "Better luck next time!",
                    });
                }

                if (onBetPlaced) onBetPlaced();
            }, 2000);
        } catch (error) {
            setIsFlipping(false);
            toast.error("Error placing bet", {
                description: error.response?.data?.message || "Failed to place bet",
            });
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Place Your Bet</CardTitle>
                    <CardDescription>Choose heads or tails and place your bet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Coin choice */}
                    <div className="space-y-3">
                        <Label>Choose your side:</Label>
                        <RadioGroup
                            value={choice}
                            onValueChange={setChoice}
                            className="flex gap-4 justify-center"
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <Label
                                    htmlFor="heads"
                                    className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer border-2 ${choice === "heads"
                                        ? "border-primary bg-primary/10"
                                        : "border-border"
                                        }`}
                                >
                                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-xl font-bold text-yellow-800">H</span>
                                    </div>
                                    <RadioGroupItem
                                        value="heads"
                                        id="heads"
                                        className="sr-only"
                                    />
                                </Label>
                                <span>Heads</span>
                            </div>

                            <div className="flex flex-col items-center space-y-2">
                                <Label
                                    htmlFor="tails"
                                    className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer border-2 ${choice === "tails"
                                        ? "border-primary bg-primary/10"
                                        : "border-border"
                                        }`}
                                >
                                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-xl font-bold text-yellow-800">T</span>
                                    </div>
                                    <RadioGroupItem
                                        value="tails"
                                        id="tails"
                                        className="sr-only"
                                    />
                                </Label>
                                <span>Tails</span>
                            </div>
                        </RadioGroup>
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
                        <p className="text-xs text-muted-foreground">Win 1.95x your bet!</p>
                    </div>

                    {/* Place bet button */}
                    <Button
                        onClick={placeBet}
                        disabled={isFlipping || !user}
                        className="w-full"
                        size="lg"
                    >
                        {isFlipping ? "Flipping..." : "Flip Coin"}
                    </Button>
                </CardContent>
            </Card>

            {/* Results area */}
            <Card>
                <CardHeader>
                    <CardTitle>Result</CardTitle>
                    <CardDescription>Watch the coin flip and see if you win!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                    {isFlipping ? (
                        <motion.div
                            animate={{ rotateY: [0, 1080] }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="w-40 h-40 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <span className="text-4xl font-bold text-yellow-800">?</span>
                        </motion.div>
                    ) : result ? (
                        <div className="text-center">
                            <div className="w-40 h-40 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <span className="text-4xl font-bold text-yellow-800">
                                    {result.outcome === "heads" ? "H" : "T"}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">
                                    {result.won ? "You Won!" : "You Lost!"}
                                </h3>
                                {result.won && (
                                    <p className="text-green-500 text-lg">+₹{result.payout.toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <div className="w-40 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center mb-4">
                                <span className="text-xl">Ready</span>
                            </div>
                            <p>Place a bet to flip the coin</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}