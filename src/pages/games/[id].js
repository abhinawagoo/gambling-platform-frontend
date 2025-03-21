// src/pages/games/[id].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CoinFlipGame } from "@/components/games/CoinFlipGame";
import { DiceRollGame } from "@/components/games/DiceRollGame";
import { RouletteGame } from "@/components/games/RouletteGame";
import { SlotsGame } from "@/components/games/SlotsGame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function GamePage() {
  const router = useRouter();
  const { id } = router.query;
  const [gameComponent, setGameComponent] = useState(null);

  useEffect(() => {
    if (!id) return;

    // Map game IDs to their respective components
    const gameComponents = {
      coinFlip: <CoinFlipGame />,
      diceRoll: <DiceRollGame />,
      roulette: <RouletteGame />,
      slots: <SlotsGame />,
    };

    setGameComponent(gameComponents[id] || null);
  }, [id]);

  // If the page is still loading or the game doesn't exist
  if (!id || !gameComponent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 px-4 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">
              {!id ? "Loading..." : "Game Not Found"}
            </h1>
            {id && !gameComponent && (
              <>
                <p className="text-muted-foreground mb-4">
                  The game you&apos;re looking for doesn&apos;t exist or is
                  currently unavailable.
                </p>
                <Link href="/games">
                  <Button>Browse Games</Button>
                </Link>
              </>
            )}
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Game titles for the header
  const gameTitles = {
    coinFlip: "Coin Flip",
    diceRoll: "Dice Roll",
    roulette: "Roulette",
    slots: "Slots Machine",
  };

  // Game descriptions
  const gameDescriptions = {
    coinFlip:
      "A simple game of chance. Choose heads or tails and place your bet.",
    diceRoll:
      "Roll the dice and bet on the outcome. Choose between high, low, or an exact number.",
    roulette:
      "The classic casino game. Place your bets and watch the wheel spin.",
    slots: "Spin the reels and match symbols to win big prizes!",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{gameTitles[id] || id}</h1>
            <p className="text-muted-foreground">
              {gameDescriptions[id] || "Try your luck with this exciting game!"}
            </p>
          </div>

          {gameComponent}
        </div>
      </main>

      <Footer />
    </div>
  );
}
