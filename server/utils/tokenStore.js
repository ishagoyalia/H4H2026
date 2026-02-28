// tokenStore.js - simple file-based token storage for demonstration purposes
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const storePath = path.join(dataDir, 'tokens.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(storePath)) fs.writeFileSync(storePath, JSON.stringify({}), 'utf8');
}

function readStore() {
  ensureStore();
  try {
    const raw = fs.readFileSync(storePath, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}

function writeStore(obj) {
  ensureStore();
  fs.writeFileSync(storePath, JSON.stringify(obj, null, 2), 'utf8');
}

function saveTokens(userId, tokens) {
  const store = readStore();
  store[userId] = tokens;
  writeStore(store);
}

function getTokens(userId) {
  const store = readStore();
  return store[userId] || null;
}

module.exports = { saveTokens, getTokens };
