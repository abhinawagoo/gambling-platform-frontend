// src/components/games/RouletteGame.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { gamesService } from "@/services/games.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function RouletteGame({ onBetPlaced }) {
    const { user, refreshBalance } = useAuth();
    const [betType, setBetType] = useState("red");
    const [straightNumber, setStraightNumber] = useState(0);
    const [amount, setAmount] = useState(10);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);

    // Predefined bet amounts
    const betAmounts = [10, 20, 50, 100, 500];

    // Roulette wheel numbers and colors
    const rouletteNumbers = [
        { number: 0, color: "green" },
        { number: 32, color: "red" },
        { number: 15, color: "black" },
        { number: 19, color: "red" },
        { number: 4, color: "black" },
        { number: 21, color: "red" },
        { number: 2, color: "black" },
        { number: 25, color: "red" },
        { number: 17, color: "black" },
        { number: 34, color: "red" },
        { number: 6, color: "black" },
        { number: 27, color: "red" },
        { number: 13, color: "black" },
        { number: 36, color: "red" },
        { number: 11, color: "black" },
        { number: 30, color: "red" },
        { number: 8, color: "black" },
        { number: 23, color: "red" },
        { number: 10, color: "black" },
        { number: 5, color: "red" },
        { number: 24, color: "black" },
        { number: 16, color: "red" },
        { number: 33, color: "black" },
        { number: 1, color: "red" },
        { number: 20, color: "black" },
        { number: 14, color: "red" },
        { number: 31, color: "black" },
        { number: 9, color: "red" },
        { number: 22, color: "black" },
        { number: 18, color: "red" },
        { number: 29, color: "black" },
        { number: 7, color: "red" },
        { number: 28, color: "black" },
        { number: 12, color: "red" },
        { number: 35, color: "black" },
        { number: 3, color: "red" },
        { number: 26, color: "black" }
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

            // Prepare bet details based on bet type
            const betDetails = {
                type: betType
            };

            if (betType === "straight") {
                betDetails.number = parseInt(straightNumber);
            }

            const response = await gamesService.placeBet({
                gameType: "roulette",
                amount,
                betDetails
            });

            // Simulate roulette spin animation
            setTimeout(() => {
                setResult(response.gameDetails);
                setIsSpinning(false);
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
            }, 3000);
        } catch (error) {
            setIsSpinning(false);
            toast.error("Error placing bet", {
                description: error.response?.data?.message || "Failed to place bet",
            });
        }
    };

    return (
        <div className="grid md:grid-cols-5 gap-8">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Roulette</CardTitle>
                    <CardDescription>Place your bets on the roulette table</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs defaultValue="color" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-4">
                            <TabsTrigger value="color">Color</TabsTrigger>
                            <TabsTrigger value="parity">Parity</TabsTrigger>
                            <TabsTrigger value="straight">Straight</TabsTrigger>
                        </TabsList>

                        <TabsContent value="color" className="space-y-4">
                            <RadioGroup
                                value={betType}
                                onValueChange={(value) => setBetType(value)}
                                className="grid grid-cols-3 gap-2"
                            >
                                <div>
                                    <RadioGroupItem value="red" id="red" className="peer sr-only" />
                                    <Label
                                        htmlFor="red"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <span>Red</span>
                                        <div className="w-12 h-12 bg-red-600 rounded-full mt-2"></div>
                                        <span className="text-xs text-muted-foreground mt-1">1.95x</span>
                                    </Label>
                                </div>

                                <div>
                                    <RadioGroupItem value="black" id="black" className="peer sr-only" />
                                    <Label
                                        htmlFor="black"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <span>Black</span>
                                        <div className="w-12 h-12 bg-black rounded-full mt-2"></div>
                                        <span className="text-xs text-muted-foreground mt-1">1.95x</span>
                                    </Label>
                                </div>

                                <div>
                                    <RadioGroupItem value="green" id="green" className="peer sr-only" />
                                    <Label
                                        htmlFor="green"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <span>Green (0)</span>
                                        <div className="w-12 h-12 bg-green-600 rounded-full mt-2"></div>
                                        <span className="text-xs text-muted-foreground mt-1">35x</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </TabsContent>

                        <TabsContent value="parity" className="space-y-4">
                            <div className="grid grid-cols-4 gap-2">
                                <div>
                                    <RadioGroupItem
                                        value="even"
                                        id="even"
                                        className="peer sr-only"
                                        checked={betType === "even"}
                                        onCheckedChange={() => setBetType("even")}
                                    />
                                    <Label
                                        htmlFor="even"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <span>Even</span>
                                        <span className="text-xs text-muted-foreground mt-1">1.95x</span>
                                    </Label>
                                </div>

                                <div>
                                    <RadioGroupItem
                                        value="odd"
                                        id="odd"
                                        className="peer sr-only"
                                        checked={betType === "odd"}
                                        onCheckedChange={() => setBetType("odd")}
                                    />
                                    <Label
                                        htmlFor="odd"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <span>Odd</span>
                                        <span className="text-xs text-muted-foreground mt-1">1.95x</span>
                                    </Label>
                                </div>

                                <div>
                                    <RadioGroupItem
                                        value="low"
                                        id="low"
                                        className="peer sr-only"
                                        checked={betType === "low"}
                                        onCheckedChange={() => setBetType("low")}
                                    />
                                    <Label
                                        htmlFor="low"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <span>1-18</span>
                                        <span className="text-xs text-muted-foreground mt-1">1.95x</span>
                                    </Label>
                                </div>

                                <div>
                                    <RadioGroupItem
                                        value="high"
                                        id="high"
                                        className="peer sr-only"
                                        checked={betType === "high"}
                                        onCheckedChange={() => setBetType("high")}
                                    />
                                    <Label
                                        htmlFor="high"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <span>19-36</span>
                                        <span className="text-xs text-muted-foreground mt-1">1.95x</span>
                                    </Label>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="straight" className="space-y-4">
                            <Label>Select a number (0-36):</Label>
                            <div className="grid grid-cols-6 gap-1">
                                <Button
                                    variant={straightNumber === 0 ? "default" : "outline"}
                                    className="h-10 bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                        setBetType("straight");
                                        setStraightNumber(0);
                                    }}
                                >
                                    0
                                </Button>
                                {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => {
                                    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num);
                                    return (
                                        <Button
                                            key={num}
                                            variant={straightNumber === num ? "default" : "outline"}
                                            className={`h-10 ${isRed ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-gray-800"}`}
                                            onClick={() => {
                                                setBetType("straight");
                                                setStraightNumber(num);
                                            }}
                                        >
                                            {num}
                                        </Button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">Win 35x your bet for exact number</p>
                        </TabsContent>
                    </Tabs>

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
                            {betType === "straight"
                                ? "Win 35x your bet for exact number"
                                : betType === "green"
                                    ? "Win 35x your bet for green (0)"
                                    : "Win 1.95x your bet"}
                        </p>
                    </div>

                    {/* Place bet button */}
                    <Button
                        onClick={placeBet}
                        disabled={isSpinning || !user}
                        className="w-full"
                        size="lg"
                    >
                        {isSpinning ? "Spinning..." : "Spin Roulette"}
                    </Button>
                </CardContent>
            </Card>

            {/* Roulette wheel and result display */}
            <Card className="md:col-span-3">
                <CardHeader>
                    <CardTitle>Roulette Wheel</CardTitle>
                    <CardDescription>Watch the wheel spin and see if you win!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                    {isSpinning ? (
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                            <div className="absolute inset-0 rounded-full border-8 border-gray-800 overflow-hidden">
                                <motion.div
                                    animate={{ rotate: [0, 1440] }}
                                    transition={{ duration: 3, ease: "easeInOut" }}
                                    className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center relative"
                                >
                                    {/* Simplified roulette wheel segments */}
                                    {rouletteNumbers.map((item, index) => {
                                        const rotation = index * (360 / rouletteNumbers.length);
                                        return (
                                            <div
                                                key={item.number}
                                                className={`absolute w-full h-1 origin-left top-1/2 -translate-y-1/2`}
                                                style={{ transform: `rotate(${rotation}deg)` }}
                                            >
                                                <div
                                                    className={`ml-14 md:ml-16 w-[calc(100%-56px)] md:w-[calc(100%-64px)] h-8 -mt-4 
                           ${item.color === "red" ? "bg-red-600" : item.color === "black" ? "bg-black" : "bg-green-600"}`}
                                                >
                                                    <span className="text-white text-xs absolute left-4 top-1.5">{item.number}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-4 h-8 bg-white z-10"></div>
                        </div>
                    ) : result ? (
                        <div className="text-center">
                            <div className="w-40 h-40 rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-gray-300"
                                style={{ backgroundColor: result.resultColor }}
                            >
                                <span className="text-4xl font-bold text-white">{result.resultValue}</span>
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
                            <div className="w-64 h-64 md:w-80 md:h-80 border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                                <span className="text-xl">Ready to spin</span>
                            </div>
                            <p>Place a bet to spin the wheel</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}