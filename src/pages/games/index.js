// src/pages/games/index.js
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GameCard } from "@/components/games/GameCard";
import { Input } from "@/components/ui/input";
import { gamesService } from "@/services/games.service";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const response = await gamesService.getAvailableGames();

        // Enhance game data with additional frontend details
        const enhancedGames = response.games.map((game) => ({
          ...game,
          description: getGameDescription(game.id),
          minBet: 10,
          maxPayout: getGameMaxPayout(game.id),
          image: null,
        }));

        setGames(enhancedGames);
      } catch (error) {
        console.error("Failed to load games:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  // Helper function to get game descriptions
  const getGameDescription = (gameId) => {
    const descriptions = {
      coinFlip: "A simple game of chance. Bet on heads or tails.",
      diceRoll: "Roll the dice and bet on high, low, or exact numbers.",
      roulette: "The classic casino game with multiple betting options.",
      slots: "Spin the reels and match symbols to win big prizes!",
    };

    return descriptions[gameId] || "Try your luck with this exciting game!";
  };

  // Helper function to get max payout for each game
  const getGameMaxPayout = (gameId) => {
    const payouts = {
      coinFlip: "1.95x",
      diceRoll: "5.85x",
      roulette: "35x",
      slots: "100x",
    };

    return payouts[gameId] || "??x";
  };

  // Filter games based on search term
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">All Games</h1>

          {/* Search box */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="w-full md:w-64">
              <Input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Games listing */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading games...</p>
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No games found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
