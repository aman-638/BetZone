import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Matches API
  app.get("/api/matches", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Bets APIs
  app.post("/api/bets", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const { matchId, teamType, amount } = req.body;
      
      // Validate required fields
      if (!matchId || !teamType || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Validate match exists
      const match = await storage.getMatchById(matchId);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      // Create the bet
      const bet = await storage.createBet({
        userId,
        matchId,
        teamType,
        amount: parseFloat(amount),
        odds: teamType === "home" ? match.teams.home.odds : match.teams.away.odds,
      });
      
      // Start a timer to resolve the bet after 30 seconds
      setTimeout(async () => {
        await storage.resolveBet(bet.id);
      }, 30000);
      
      res.status(201).json(bet);
    } catch (error) {
      console.error("Error placing bet:", error);
      res.status(500).json({ message: "Failed to place bet" });
    }
  });
  
  app.get("/api/bets", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const bets = await storage.getBetsByUser(userId);
      res.json(bets);
    } catch (error) {
      console.error("Error fetching bets:", error);
      res.status(500).json({ message: "Failed to fetch bets" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
