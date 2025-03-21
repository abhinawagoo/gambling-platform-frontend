// src/components/wallet/DepositForm.jsx
import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function DepositForm() {
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { createDepositOrder, verifyDeposit } = useWallet();
    const { refreshBalance, user } = useAuth();

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) < 100) {
            toast.error("Invalid amount", {
                description: "Minimum deposit amount is ₹100",
            });
            return;
        }

        try {
            setIsLoading(true);

            // Create deposit order
            const order = await createDepositOrder(parseFloat(amount));

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Use environment variable
                amount: order.order.amount * 100, // Razorpay amount in paisa
                currency: order.order.currency,
                name: "GamblePro",
                description: "Deposit funds",
                order_id: order.order.id,
                handler: async function (response) {
                    // Verify payment
                    await handlePaymentVerification(response);
                },
                prefill: {
                    email: user?.email || "",
                },
                theme: {
                    color: "#8B5CF6", // Match your theme color
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error("Deposit failed", {
                description: error.response?.data?.message || "Could not process deposit",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentVerification = async (response) => {
        try {
            await verifyDeposit({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: parseFloat(amount),
            });

            // Refresh user balance
            refreshBalance();

            toast.success("Deposit successful", {
                description: `₹${amount} has been added to your account!`,
            });

            // Reset form
            setAmount("");
        } catch (error) {
            toast.error("Payment verification failed", {
                description: error.response?.data?.message || "Could not verify payment",
            });
        }
    };

    const presetAmounts = [100, 500, 1000, 2000, 5000];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>
                    Add money to your account to start playing
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
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Minimum deposit: ₹100</p>
                </div>

                <div className="space-y-2">
                    <Label>Quick select:</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {presetAmounts.map((value) => (
                            <Button
                                key={value}
                                type="button"
                                variant="outline"
                                onClick={() => setAmount(value.toString())}
                            >
                                ₹{value}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    disabled={isLoading || !amount || parseFloat(amount) < 100}
                    onClick={handleDeposit}
                >
                    {isLoading ? "Processing..." : "Deposit Now"}
                </Button>
            </CardFooter>
        </Card>
    );
}