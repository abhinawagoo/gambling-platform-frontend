// src/components/games/GameCard.jsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function GameCard({ game }) {
    const { id, name, description, minBet, maxPayout, image } = game;

    // Create game-specific background colors
    const getBgColor = (gameId) => {
        const colors = {
            coinFlip: "from-yellow-500 to-yellow-600",
            diceRoll: "from-blue-500 to-blue-600",
            roulette: "from-red-500 to-red-600",
            slots: "from-purple-500 to-purple-600"
        };

        return colors[gameId] || "from-indigo-500 to-purple-600";
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className={`aspect-video relative overflow-hidden bg-gradient-to-br ${getBgColor(id)}`}>
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{name}</span>
                    </div>
                )}
            </div>
            <CardHeader className="pb-2">
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                    Min bet: ₹{minBet} • Max payout: {maxPayout}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-sm pb-2">
                <p>{description}</p>
            </CardContent>
            <CardFooter>
                <Link href={`/games/${id}`} className="w-full">
                    <Button className="w-full">Play Now</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}