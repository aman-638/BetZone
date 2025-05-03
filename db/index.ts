import * as fs from 'fs';
import * as path from 'path';

// Define the path to our data files
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MATCHES_FILE = path.join(DATA_DIR, 'matches.json');
const BETS_FILE = path.join(DATA_DIR, 'bets.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files with empty arrays if they don't exist
[USERS_FILE, MATCHES_FILE, BETS_FILE].forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
});

// Helper functions to read and write JSON data
export const readJsonFile = (filePath: string) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return [];
  }
};

export const writeJsonFile = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file: ${filePath}`, error);
    return false;
  }
};

// Export file paths for use in other modules
export const dataFiles = {
  USERS_FILE,
  MATCHES_FILE,
  BETS_FILE
};