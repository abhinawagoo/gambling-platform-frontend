// src/pages/wallet/deposit.js
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DepositForm } from "@/components/wallet/DepositForm";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

export default function DepositPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      router.push("/auth/login?redirect=/wallet/deposit");
    }
  }, [user, router]);

  if (!user) {
    return null; // Don't render anything until redirect happens
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Deposit Funds</h1>

          <div className="grid gap-8">
            <DepositForm />

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Deposit Information
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Minimum deposit amount: ₹100</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Get a 50% bonus on every deposit you make!</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    All deposits are processed instantly through our secure
                    payment gateway.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    We accept multiple payment methods including credit/debit
                    cards, UPI, net banking, and more.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Your payment information is securely processed by Razorpay
                    and is never stored on our servers.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
