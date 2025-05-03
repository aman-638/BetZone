import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  balance: z.number().default(1250),
  createdAt: z
    .string()
    .or(z.date())
    .default(() => new Date().toISOString()),
});

export const insertUserSchema = userSchema.pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;

// Match schema - for sports matches
export const matchSchema = z.object({
  id: z.string(),
  league: z.string(),
  sport: z.string(),
  startTime: z.string().or(z.date()),
  startingIn: z.string().optional(),
  teams: z.object({
    home: z.object({
      name: z.string(),
      initial: z.string(),
      odds: z.number(),
    }),
    away: z.object({
      name: z.string(),
      initial: z.string(),
      odds: z.number(),
    }),
  }),
  createdAt: z
    .string()
    .or(z.date())
    .default(() => new Date().toISOString()),
});

export type Match = z.infer<typeof matchSchema>;

// Bet schema
export const betSchema = z.object({
  id: z.string(),
  userId: z.number(),
  matchId: z.string(),
  matchName: z.string(),
  sport: z.string(),
  league: z.string(),
  teamSelected: z.string(),
  odds: z.number(),
  amount: z.number(),
  potentialWin: z.number(),
  status: z.enum(["PENDING", "WIN", "LOSE"]).default("PENDING"),
  createdAt: z
    .string()
    .or(z.date())
    .default(() => new Date().toISOString()),
});

export type Bet = z.infer<typeof betSchema>;

// Create bet params
export const createBetSchema = z.object({
  matchId: z.string(),
  teamType: z.enum(["home", "away"]),
  amount: z.number().min(5, "Minimum bet is $5"),
});

export type CreateBetParams = z.infer<typeof createBetSchema>;
