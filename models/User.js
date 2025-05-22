// models/User.js
const db = require('../config/db');

// helper برای خواندن آرایه‌ی users از Lowdb
async function getUsers() {
  await db.read();
  db.data = db.data || { users: [] };
  return db.data.users;
}

module.exports = {
  /**
   * شبیه Sequelize.findOne
   */
  findOne: async ({ where }) => {
    const users = await getUsers();
    if (where.phone && where.email) {
      return users.find(
        (u) => u.phone === where.phone || u.email === where.email
      );
    }
    if (where.phone) {
      return users.find((u) => u.phone === where.phone);
    }
    if (where.email) {
      return users.find((u) => u.email === where.email);
    }
    return null;
  },

  /**
   * شبیه Sequelize.findByPk
   */
  findByPk: async (id) => {
    const users = await getUsers();
    return users.find((u) => u.id === id) || null;
  },

  /**
   * شبیه Sequelize.create
   * اضافه کردن فیلد active با مقدار پیش‌فرض false در صورت عدم وجود data.active
   */
  create: async (data) => {
    const users = await getUsers();
    const existingIds = users.map((u) => u.id);
    const newId = existingIds.length ? Math.max(...existingIds) + 1 : 1;

    // active به‌صورت پیش‌فرض false است مگر اینکه صراحتاً data.active=true باشد
    const newUser = {
      id: newId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      passwordHash: data.passwordHash,
      isVerified: data.isVerified,
      friendCode: data.friendCode,
      active: data.active === true, // فیلد جدید
      createdAt: Date.now()
    };

    users.push(newUser);
    db.data.users = users;
    await db.write();

    return newUser;
  },

  /**
   * شبیه Sequelize.destroy (در صورت نیاز)
   */
  destroy: async ({ where }) => {
    let users = await getUsers();
    if (where.id !== undefined) {
      users = users.filter((u) => u.id !== where.id);
    } else {
      Object.keys(where).forEach((key) => {
        users = users.filter((u) => u[key] !== where[key]);
      });
    }
    db.data.users = users;
    await db.write();
  },

  /**
   * شبیه Sequelize.update
   */
  update: async (data, { where }) => {
    const users = await getUsers();
    let updated = null;
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      let matches = true;
      Object.keys(where).forEach((key) => {
        if (u[key] !== where[key]) matches = false;
      });
      if (matches) {
        const newUser = { ...u, ...data };
        users[i] = newUser;
        updated = newUser;
        break;
      }
    }
    db.data.users = users;
    await db.write();
    return updated;
  }
};
