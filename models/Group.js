// models/Group.js
const { customAlphabet } = require('nanoid');
const db                  = require('../config/db');

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  16
);

class Group {
  static async findAll() {
    await db.read();
    return db.data.groups || [];
  }

  static async findOne(id) {
    await db.read();
    return (db.data.groups || []).find(g => g.id === id);
  }

  static async create({ name, score = 0 }) {
    await db.read();
    db.data.groups = db.data.groups || [];
    const group = {
      id: nanoid(),
      name,
      score: Number(score),
      members: []
    };
    db.data.groups.push(group);
    await db.write();
    return group;
  }

  static async update(id, { name, score }) {
    await db.read();
    const groups = db.data.groups || [];
    const idx = groups.findIndex(g => g.id === id);
    if (idx === -1) return null;
    if (name  !== undefined) groups[idx].name  = name;
    if (score !== undefined) groups[idx].score = Number(score);
    await db.write();
    return groups[idx];
  }
}

module.exports = Group;
