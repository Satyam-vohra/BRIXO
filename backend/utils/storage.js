const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

// Initialize JSON database
const initStorage = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], websites: [] }, null, 2), "utf-8");
  }
};

const readData = () => {
  initStorage();
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON database file:", error);
    return { users: [], websites: [] };
  }
};

const writeData = (data) => {
  initStorage();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to JSON database file:", error);
  }
};

// Users queries & updates
const getUsers = () => readData().users;

const saveUser = (user) => {
  const data = readData();
  const newUser = {
    _id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...user
  };
  data.users.push(newUser);
  writeData(data);
  return newUser;
};

const getUserByEmail = (email) => {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
};

const getUserById = (id) => {
  return getUsers().find(u => u._id === id);
};

// Websites queries & updates
const getWebsites = () => readData().websites;

const getWebsiteById = (id) => {
  return getWebsites().find(w => w._id === id);
};

const saveWebsite = (website) => {
  const data = readData();
  const newWebsite = {
    _id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: false,
    ...website
  };
  data.websites.push(newWebsite);
  writeData(data);
  return newWebsite;
};

const updateWebsite = (id, updateFields) => {
  const data = readData();
  const index = data.websites.findIndex(w => w._id === id);
  if (index === -1) return null;

  data.websites[index] = {
    ...data.websites[index],
    ...updateFields,
    updatedAt: new Date().toISOString()
  };
  writeData(data);
  return data.websites[index];
};

module.exports = {
  getUsers,
  saveUser,
  getUserByEmail,
  getUserById,
  getWebsites,
  getWebsiteById,
  saveWebsite,
  updateWebsite
};
