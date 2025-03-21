// src/pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/games/GameCard";
import { gamesService } from "@/services/games.service";

export default function HomePage() {
  const [featuredGames, setFeaturedGames] = useState([]);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await gamesService.getGames();
        setFeaturedGames(response.games);
      } catch (error) {
        console.error("Failed to load games:", error);
      }
    };

    loadGames();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-800 py-20 px-4">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Play. Win. Repeat.
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Experience the thrill of our premium online gambling platform
                with fair games and instant payouts.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Join Now
                  </Button>
                </Link>
                <Link href="/games">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Browse Games
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Games */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">Featured Games</h2>
              <Link href="/games">
                <Button variant="ghost">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}

              {/* Fallback if no games are loaded */}
              {featuredGames.length === 0 && (
                <div className="col-span-3 text-center py-20">
                  <p className="text-muted-foreground">Loading games...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bonuses Section */}
        <section className="bg-gray-100 dark:bg-gray-800 py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">
              Exclusive Bonuses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  ₹1,000
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome Bonus</h3>
                <p className="text-muted-foreground mb-4">
                  Get a 100% match on your first deposit up to ₹1,000.
                </p>
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full">
                    Claim Now
                  </Button>
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  50%
                </div>
                <h3 className="text-xl font-semibold mb-2">Reload Bonus</h3>
                <p className="text-muted-foreground mb-4">
                  Get a 50% bonus on every deposit you make.
                </p>
                <Link href="/wallet/deposit">
                  <Button variant="outline" className="w-full">
                    Deposit Now
                  </Button>
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  10%
                </div>
                <h3 className="text-xl font-semibold mb-2">Cashback</h3>
                <p className="text-muted-foreground mb-4">
                  Get 10% cashback on losses every weekend.
                </p>
                <Link href="/promotions">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                <p className="text-muted-foreground">
                  Sign up in seconds and get a welcome bonus.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Make a Deposit</h3>
                <p className="text-muted-foreground">
                  Fund your account securely with multiple payment options.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Play & Win</h3>
                <p className="text-muted-foreground">
                  Start playing your favorite games and withdraw your winnings
                  instantly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
