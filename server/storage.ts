import { readJsonFile, writeJsonFile, dataFiles } from "@db";
import session from "express-session";
import memorystore from "memorystore";
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface User {
  id: number;
  username: string;
  password: string;
  balance: number;
  createdAt: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

const MemoryStore = memorystore(session);

export interface Match {
  id: string;
  league: string;
  sport: string;
  startTime: string;
  startingIn: string;
  teams: {
    home: {
      name: string;
      initial: string;
      odds: number;
    };
    away: {
      name: string;
      initial: string;
      odds: number;
    };
  };
}

export interface CreateBetParams {
  userId: number;
  matchId: string;
  teamType: 'home' | 'away';
  amount: number;
  odds: number;
}

export interface Bet {
  id: string;
  userId: number;
  matchId: string;
  matchName: string;
  sport: string;
  league: string;
  teamSelected: string;
  odds: number;
  amount: number;
  potentialWin: number;
  status: 'PENDING' | 'WIN' | 'LOSE';
  createdAt: string;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Match methods
  getMatches(): Promise<Match[]>;
  getMatchById(id: string): Promise<Match | undefined>;
  
  // Bet methods
  createBet(params: CreateBetParams): Promise<Bet>;
  getBetsByUser(userId: number): Promise<Bet[]>;
  resolveBet(betId: string): Promise<void>;
  
  // Session store
  sessionStore: any; // Using any to bypass typing issues
}

class JsonFileStorage implements IStorage {
  sessionStore: any; // Using any to bypass typing issues
  
  constructor() {
    // Use memory store for session
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize data with sample matches if needed
    this._initializeData();
  }
  
  private _initializeData() {
    // Initialize matches if the file is empty
    const matches = readJsonFile(dataFiles.MATCHES_FILE);
    if (matches.length === 0) {
      const now = new Date();
      const sampleMatches = [
        {
          id: "1",
          league: "Premier League",
          sport: "Football",
          startTime: new Date(now.getTime() + 45 * 60000).toISOString(),
          startingIn: "Starting in 45m",
          teams: {
            home: {
              name: "Arsenal",
              initial: "A",
              odds: 2.10
            },
            away: {
              name: "Chelsea",
              initial: "C",
              odds: 1.85
            }
          }
        },
        {
          id: "2",
          league: "NBA",
          sport: "Basketball",
          startTime: new Date(now.getTime() + 2 * 60 * 60000).toISOString(),
          startingIn: "Starting in 2h",
          teams: {
            home: {
              name: "Lakers",
              initial: "L",
              odds: 1.75
            },
            away: {
              name: "Bulls",
              initial: "B",
              odds: 2.25
            }
          }
        },
        {
          id: "3",
          league: "Tennis Grand Slam",
          sport: "Tennis",
          startTime: new Date(now.getTime() + 3 * 60 * 60000).toISOString(),
          startingIn: "Starting in 3h",
          teams: {
            home: {
              name: "Nadal",
              initial: "N",
              odds: 2.05
            },
            away: {
              name: "Djokovic",
              initial: "D",
              odds: 1.90
            }
          }
        },
        {
          id: "4",
          league: "Premier League",
          sport: "Football",
          startTime: new Date(now.getTime() + 6 * 60 * 60000).toISOString(),
          startingIn: "Starting in 6h",
          teams: {
            home: {
              name: "Liverpool",
              initial: "L",
              odds: 1.95
            },
            away: {
              name: "Manchester City",
              initial: "M",
              odds: 2.05
            }
          }
        },
        {
          id: "5",
          league: "NHL",
          sport: "Hockey",
          startTime: new Date(now.getTime() + 5 * 60 * 60000).toISOString(),
          startingIn: "Starting in 5h",
          teams: {
            home: {
              name: "Maple Leafs",
              initial: "M",
              odds: 2.15
            },
            away: {
              name: "Bruins",
              initial: "B",
              odds: 1.85
            }
          }
        }
      ];
      
      writeJsonFile(dataFiles.MATCHES_FILE, sampleMatches);
    }
    
    // Initialize users with demo user if the file is empty
    const users = readJsonFile(dataFiles.USERS_FILE);
    if (users.length === 0) {
      // Add demo user
      const demoUser = {
        id: 1,
        username: "user1@bet.com",
        password: "$2b$10$9CvqsxnKYGBRUwHlr1DoT.UQn5QRcXrvHvrx1TWtbdtQOsEAqY0hy", // Bet@123
        balance: 1250,
        createdAt: new Date().toISOString()
      };
      writeJsonFile(dataFiles.USERS_FILE, [demoUser]);
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User> {
    const users = readJsonFile(dataFiles.USERS_FILE);
    const user = users.find((u: User) => u.id === id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = readJsonFile(dataFiles.USERS_FILE);
    return users.find((u: User) => u.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const users = readJsonFile(dataFiles.USERS_FILE);
    
    // Generate a new ID (find the max ID and add 1, or start at 1)
    const maxId = users.length > 0 
      ? Math.max(...users.map((u: User) => u.id)) 
      : 0;
    
    const newUser: User = {
      id: maxId + 1,
      username: user.username,
      password: user.password,
      balance: 1250, // Starting balance for new users
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    writeJsonFile(dataFiles.USERS_FILE, users);
    
    return newUser;
  }
  
  // Match methods
  async getMatches(): Promise<Match[]> {
    return readJsonFile(dataFiles.MATCHES_FILE);
  }
  
  async getMatchById(id: string): Promise<Match | undefined> {
    const matches = readJsonFile(dataFiles.MATCHES_FILE);
    return matches.find((match: Match) => match.id === id);
  }
  
  // Bet methods
  async createBet(params: CreateBetParams): Promise<Bet> {
    const match = await this.getMatchById(params.matchId);
    if (!match) {
      throw new Error(`Match with ID ${params.matchId} not found`);
    }
    
    const teamSelected = params.teamType === 'home' 
      ? match.teams.home.name 
      : match.teams.away.name;
    
    const potentialWin = parseFloat((params.amount * params.odds).toFixed(2));
    
    const bet: Bet = {
      id: uuidv4(),
      userId: params.userId,
      matchId: params.matchId,
      matchName: `${match.teams.home.name} vs ${match.teams.away.name}`,
      sport: match.sport,
      league: match.league,
      teamSelected,
      odds: params.odds,
      amount: params.amount,
      potentialWin,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    
    // Add bet to the file
    const bets = readJsonFile(dataFiles.BETS_FILE);
    bets.push(bet);
    writeJsonFile(dataFiles.BETS_FILE, bets);
    
    // Update user balance - deduct bet amount
    const users = readJsonFile(dataFiles.USERS_FILE);
    const userIndex = users.findIndex((u: User) => u.id === params.userId);
    
    if (userIndex !== -1) {
      users[userIndex].balance -= params.amount;
      writeJsonFile(dataFiles.USERS_FILE, users);
    }
    
    return bet;
  }
  
  async getBetsByUser(userId: number): Promise<Bet[]> {
    const bets = readJsonFile(dataFiles.BETS_FILE);
    return bets
      .filter((bet: Bet) => bet.userId === userId)
      .sort((a: Bet, b: Bet) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async resolveBet(betId: string): Promise<void> {
    const bets = readJsonFile(dataFiles.BETS_FILE);
    const betIndex = bets.findIndex((bet: Bet) => bet.id === betId);
    
    if (betIndex === -1) {
      throw new Error(`Bet with ID ${betId} not found`);
    }
    
    // Randomly decide if the bet is a win or lose
    const isWin = Math.random() > 0.5;
    bets[betIndex].status = isWin ? 'WIN' : 'LOSE';
    
    // Update bets file
    writeJsonFile(dataFiles.BETS_FILE, bets);
    
    // If win, update user balance
    if (isWin) {
      const bet = bets[betIndex];
      const users = readJsonFile(dataFiles.USERS_FILE);
      const userIndex = users.findIndex((u: User) => u.id === bet.userId);
      
      if (userIndex !== -1) {
        // Add winnings to balance
        users[userIndex].balance += bet.potentialWin;
        writeJsonFile(dataFiles.USERS_FILE, users);
      }
    }
    
    return Promise.resolve();
  }
}

export const storage = new JsonFileStorage();
