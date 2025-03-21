// src/hooks/useWallet.js
import { useState } from "react";
import { walletService } from "@/services/wallet.service";

export function useWallet() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDepositOrder = async (amount) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await walletService.createDepositOrder(amount);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create deposit order");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyDeposit = async (paymentData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await walletService.verifyDeposit(paymentData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify payment");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestWithdrawal = async (amount, accountDetails) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await walletService.requestWithdrawal(
        amount,
        accountDetails
      );
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request withdrawal");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactions = async (page = 1, limit = 10, type) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await walletService.getTransactions(page, limit, type);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createDepositOrder,
    verifyDeposit,
    requestWithdrawal,
    getTransactions,
    isLoading,
    error,
  };
}
