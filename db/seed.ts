import bcrypt from "bcrypt";
import { readJsonFile, writeJsonFile, dataFiles } from "./index";

// Function to hash passwords using bcrypt
async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// Main seed function
async function seed() {
  // Seed users if the file is empty
  const users = readJsonFile(dataFiles.USERS_FILE);
  if (users.length === 0) {
    const newUsers = [
      {
        id: 1,
        username: "user@bet.com",
        // Pre-hashed password for "Bet@123"
        password: "$2b$10$9CvqsxnKYGBRUwHlr1DoT.UQn5QRcXrvHvrx1TWtbdtQOsEAqY0hy",
        balance: 1250,
        createdAt: new Date().toISOString()
      }
    ];
    
    writeJsonFile(dataFiles.USERS_FILE, newUsers);
    console.log("Users seeded successfully!");
  } else {
    console.log("Users already exist, skipping seed.");
  }
  
  // Seed matches if the file is empty
  const matches = readJsonFile(dataFiles.MATCHES_FILE);
  if (matches.length === 0) {
    const now = new Date();
    const newMatches = [
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
    
    writeJsonFile(dataFiles.MATCHES_FILE, newMatches);
    console.log("Matches seeded successfully!");
  } else {
    console.log("Matches already exist, skipping seed.");
  }
  
  // Ensure bets file exists
  const bets = readJsonFile(dataFiles.BETS_FILE);
  if (!Array.isArray(bets)) {
    writeJsonFile(dataFiles.BETS_FILE, []);
    console.log("Bets file initialized.");
  }
}

// Run the seed function
seed().catch(console.error);