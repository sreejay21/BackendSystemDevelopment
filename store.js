const fs = require("fs");
const path = require("path");

const useJSON = process.env.STORAGE_TYPE === "json"; // env variable to toggle

const filePath = path.join(__dirname, "storageData.json");

// Load JSON file if exists
function loadData() {
  if (!useJSON || !fs.existsSync(filePath)) return { users: [], events: [] };
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return { users: [], events: [] };
  }
}

// Save to JSON
function saveData(data) {
  if (!useJSON) return;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// In-memory arrays
const memoryStore = { users: [], events: [] };
const storeData = loadData();

const store = {
  users: useJSON ? storeData.users : memoryStore.users,
  events: useJSON ? storeData.events : memoryStore.events,

  addUser(user) {
    this.users.push(user);
    saveData({ users: this.users, events: this.events });
  },
  addEvent(event) {
    this.events.push(event);
    saveData({ users: this.users, events: this.events });
  },
  reset() {
    this.users.length = 0;
    this.events.length = 0;
    saveData({ users: this.users, events: this.events });
  }
};

module.exports = store;
