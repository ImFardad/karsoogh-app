// config/db.js
const { Low }      = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path         = require('path');
const fs           = require('fs');

// مسیر فایل دیتابیس JSON
const filePath = path.resolve(__dirname, '../data.json');

// اگر فایل وجود ندارد، ایجادش کن و مقداردهی اولیه کن
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(
    filePath,
    JSON.stringify({ users: [], groups: [] }, null, 2),
    'utf-8'
  );
}

// Adapter و Instance از Lowdb
const adapter = new JSONFile(filePath);
const db      = new Low(adapter);

// متد اتصال و مقداردهی اولیه
db.connectDB = async () => {
  try {
    await db.read();
    db.data = db.data || { users: [], groups: [] };
    await db.write();
    console.log('✅ Connected to Lowdb at', filePath);
  } catch (err) {
    console.error('❌ Lowdb connection error:', err);
    process.exit(1);
  }
};

module.exports = db;
