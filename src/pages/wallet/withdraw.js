// src/pages/wallet/withdraw.js
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
// import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";

export default function WithdrawPage() {
  const { user, refreshBalance } = useAuth();
  const { requestWithdrawal, isLoading } = useWallet();
  // const { toast } = useToast();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [accountDetails, setAccountDetails] = useState({
    upiId: "",
    accountNumber: "",
    ifscCode: "",
    accountName: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      router.push("/auth/login?redirect=/wallet/withdraw");
    }
  }, [user, router]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) < 100) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Minimum withdrawal amount is ₹100",
      });
      return;
    }

    if (parseFloat(amount) > user.balance) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: "You don't have enough funds to withdraw this amount",
      });
      return;
    }

    let details = {};

    if (paymentMethod === "upi") {
      if (!accountDetails.upiId) {
        toast({
          variant: "destructive",
          title: "Missing details",
          description: "Please enter your UPI ID",
        });
        return;
      }
      details = {
        method: "upi",
        upiId: accountDetails.upiId,
      };
    } else if (paymentMethod === "bank") {
      if (
        !accountDetails.accountNumber ||
        !accountDetails.ifscCode ||
        !accountDetails.accountName
      ) {
        toast({
          variant: "destructive",
          title: "Missing details",
          description: "Please fill in all bank account details",
        });
        return;
      }
      details = {
        method: "bank",
        accountNumber: accountDetails.accountNumber,
        ifscCode: accountDetails.ifscCode,
        accountName: accountDetails.accountName,
      };
    }

    try {
      await requestWithdrawal(parseFloat(amount), details);

      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted successfully",
      });

      refreshBalance();
      router.push("/wallet");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Withdrawal failed",
        description:
          error.response?.data?.message || "Could not process withdrawal",
      });
    }
  };

  if (!user) {
    return null; // Don't render anything until redirect happens
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Withdraw Funds</h1>

          <div className="grid gap-8">
            <Card>
              <form onSubmit={handleWithdrawal}>
                <CardHeader>
                  <CardTitle>Request Withdrawal</CardTitle>
                  <CardDescription>
                    Withdraw your funds to your bank account or UPI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      min="100"
                      max={user.balance}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Available balance: ₹{Number(user.balance).toFixed(2)} •
                      Minimum withdrawal: ₹100
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Withdrawal Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === "upi" ? (
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@upi"
                        value={accountDetails.upiId}
                        onChange={(e) =>
                          setAccountDetails({
                            ...accountDetails,
                            upiId: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-name">
                          Account Holder Name
                        </Label>
                        <Input
                          id="account-name"
                          placeholder="Enter account holder name"
                          value={accountDetails.accountName}
                          onChange={(e) =>
                            setAccountDetails({
                              ...accountDetails,
                              accountName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input
                          id="account-number"
                          placeholder="Enter account number"
                          value={accountDetails.accountNumber}
                          onChange={(e) =>
                            setAccountDetails({
                              ...accountDetails,
                              accountNumber: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifsc-code">IFSC Code</Label>
                        <Input
                          id="ifsc-code"
                          placeholder="Enter IFSC code"
                          value={accountDetails.ifscCode}
                          onChange={(e) =>
                            setAccountDetails({
                              ...accountDetails,
                              ifscCode: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={
                      isLoading ||
                      !amount ||
                      parseFloat(amount) < 100 ||
                      parseFloat(amount) > user.balance
                    }
                    type="submit"
                  >
                    {isLoading ? "Processing..." : "Withdraw Funds"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Withdrawal Information
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Minimum withdrawal amount: ₹100</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Withdrawals are processed within 24 hours during business
                    days
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    You may be required to complete KYC verification for
                    withdrawals above ₹10,000
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Ensure that your account details are correct, as incorrect
                    details may result in failed withdrawals
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
