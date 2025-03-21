// src/services/games.service.js
import api from "./api";

export const gamesService = {
  getGames: async () => {
    const response = await api.get("/bets/games");
    return response.data;
  },

  placeBet: async (betData) => {
    const response = await api.post("/bets", betData);
    return response.data;
  },

  getBetHistory: async (page = 1, limit = 10, gameType, status) => {
    const response = await api.get("/bets", {
      params: {
        offset: (page - 1) * limit,
        limit,
        gameType,
        status,
      },
    });
    return response.data;
  },
  getAvailableGames: async () => {
    const response = await api.get("/bets/games");
    return response.data;
  },
};
