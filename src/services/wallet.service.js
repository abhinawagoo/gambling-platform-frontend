// src/services/wallet.service.js
import api from "./api";

export const walletService = {
  createDepositOrder: async (amount) => {
    const response = await api.post("/transactions/deposit/create", { amount });
    return response.data;
  },

  verifyDeposit: async (paymentData) => {
    const response = await api.post(
      "/transactions/deposit/verify",
      paymentData
    );
    return response.data;
  },

  requestWithdrawal: async (amount, accountDetails) => {
    const response = await api.post("/transactions/withdrawal", {
      amount,
      accountDetails,
    });
    return response.data;
  },

  getTransactions: async (page = 1, limit = 10, type) => {
    const response = await api.get("/transactions", {
      params: {
        offset: (page - 1) * limit,
        limit,
        type,
      },
    });
    return response.data;
  },

  getBonuses: async () => {
    const response = await api.get("/bonuses/my-bonuses");
    return response.data;
  },
};
