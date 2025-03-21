// src/components/games/DiceRollGame.jsx
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { gamesService } from "@/services/games.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function DiceRollGame({ onBetPlaced }) {
    const { user, refreshBalance } = useAuth();
    const [betType, setBetType] = useState("high");
    const [exactNumber, setExactNumber] = useState(6);
    const [amount, setAmount] = useState(10);
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState(null);
    // const { toast } = useToast();

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
            setIsRolling(true);

            // Prepare bet details based on bet type
            const betDetails = {
                type: betType,
            };

            if (betType === "exact") {
                betDetails.number = parseInt(exactNumber);
            }

            const response = await gamesService.placeBet({
                gameType: "diceRoll",
                amount,
                betDetails,
            });

            // Simulate dice roll animation
            setTimeout(() => {
                setResult(response.gameDetails);
                setIsRolling(false);
                refreshBalance();

                // Show result notification
                if (response.gameDetails.won) {
                    toast.success("You won!", {
                        description: `You've won ₹${Number(response.bet.payout).toFixed(2)}!`,
                    });
                } else {
                    toast.error("You lost", {
                        description: "Better luck next time!",
                    });
                }

                if (onBetPlaced) onBetPlaced();
            }, 2000);
        } catch (error) {
            setIsRolling(false);
            toast.error("Error placing bet", {
                description: error.response?.data?.message || "Failed to place bet",
            });
        }
    };

    // Dice faces as unicode characters
    const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Dice Roll</CardTitle>
                    <CardDescription>Place your bet on the dice roll outcome</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Bet type selection */}
                    <div className="space-y-3">
                        <Label>Bet Type:</Label>
                        <RadioGroup
                            value={betType}
                            onValueChange={setBetType}
                            className="grid grid-cols-3 gap-2"
                        >
                            <div>
                                <RadioGroupItem
                                    value="high"
                                    id="high"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="high"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span>High (4-6)</span>
                                    <span className="text-2xl">⚃⚄⚅</span>
                                    <span className="text-xs text-muted-foreground mt-1">1.95x</span>
                                </Label>
                            </div>

                            <div>
                                <RadioGroupItem
                                    value="low"
                                    id="low"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="low"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span>Low (1-3)</span>
                                    <span className="text-2xl">⚀⚁⚂</span>
                                    <span className="text-xs text-muted-foreground mt-1">1.95x</span>
                                </Label>
                            </div>

                            <div>
                                <RadioGroupItem
                                    value="exact"
                                    id="exact"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="exact"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span>Exact</span>
                                    <span className="text-2xl">{diceFaces[exactNumber - 1]}</span>
                                    <span className="text-xs text-muted-foreground mt-1">5.85x</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Exact number selection (if exact bet type) */}
                    {betType === "exact" && (
                        <div className="space-y-3">
                            <Label>Choose a number:</Label>
                            <div className="grid grid-cols-6 gap-2">
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <Button
                                        key={num}
                                        type="button"
                                        variant={exactNumber === num ? "default" : "outline"}
                                        onClick={() => setExactNumber(num)}
                                        className="h-12 text-xl"
                                    >
                                        {diceFaces[num - 1]}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

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
                        <p className="text-xs text-muted-foreground">
                            {betType === "exact"
                                ? "Win 5.85x your bet for exact number"
                                : "Win 1.95x your bet for High/Low"}
                        </p>
                    </div>

                    {/* Place bet button */}
                    <Button
                        onClick={placeBet}
                        disabled={isRolling || !user}
                        className="w-full"
                        size="lg"
                    >
                        {isRolling ? "Rolling..." : "Roll Dice"}
                    </Button>
                </CardContent>
            </Card>

            {/* Results area */}
            <Card>
                <CardHeader>
                    <CardTitle>Result</CardTitle>
                    <CardDescription>Watch the dice roll and see if you win!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                    {isRolling ? (
                        <motion.div
                            animate={{
                                rotate: [0, 90, 180, 270, 360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 2,
                                times: [0, 0.25, 0.5, 0.75, 1],
                                repeat: Infinity,
                                repeatDelay: 0
                            }}
                            className="w-32 h-32 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-lg text-6xl"
                        >
                            {diceFaces[Math.floor(Math.random() * 6)]}
                        </motion.div>
                    ) : result ? (
                        <div className="text-center">
                            <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 shadow-lg mx-auto">
                                <span className="text-6xl">
                                    {diceFaces[result.resultValue - 1]}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">
                                    {result.won ? "You Won!" : "You Lost!"}
                                </h3>
                                <p className="text-muted-foreground">
                                    {result.outcome}
                                </p>
                                {result.won && (
                                    <p className="text-green-500 text-lg">+₹{result.payout.toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-3xl">?</span>
                            </div>
                            <p>Place a bet to roll the dice</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}