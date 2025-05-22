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
   * پذیرش پارامتری مثل { where: { phone, email } }
   * فقط یکی از شروط phone یا email یا هردو ممکن است باشد.
   */
  findOne: async ({ where }) => {
    const users = await getUsers();
    // اگر both phone و email وجود داشته باشند، OR اعمال می‌کنیم
    if (where.phone && where.email) {
      return users.find(
        (u) => u.phone === where.phone || u.email === where.email
      );
    }
    // فقط phone
    if (where.phone) {
      return users.find((u) => u.phone === where.phone);
    }
    // فقط email
    if (where.email) {
      return users.find((u) => u.email === where.email);
    }
    return null;
  },

  /**
   * شبیه Sequelize.findByPk
   * یافتن کاربر با شناسهٔ عددی (id)
   */
  findByPk: async (id) => {
    const users = await getUsers();
    return users.find((u) => u.id === id) || null;
  },

  /**
   * شبیه Sequelize.create
   * data شامل کلیدها و مقادیر فیلدهای مدل است (مثلاً firstName, lastName و ...)
   */
  create: async (data) => {
    const users = await getUsers();
    // تعیین شناسهٔ جدید (incremental)
    const existingIds = users.map((u) => u.id);
    const newId = existingIds.length ? Math.max(...existingIds) + 1 : 1;

    // شیٔ کاربر جدید با id تولیدشده
    const newUser = { id: newId, ...data, createdAt: Date.now() };

    users.push(newUser);
    db.data.users = users;
    await db.write();

    return newUser;
  },

  /**
   * شبیه Sequelize.destroy برای پاک کردن کاربر بر اساس شرط
   * پارامتر where می‌تواند شامل مثلاً { id } یا سایر فیلدها باشد.
   * اما در سیستم احراز هویت معمولاً فقط findOne، create و findByPk نیاز داریم.
   */
  destroy: async ({ where }) => {
    let users = await getUsers();
    if (where.id !== undefined) {
      users = users.filter((u) => u.id !== where.id);
    } else {
      // فیلتر بر اساس سایر فیلدها (مثلاً phone یا email)، اگر لازم شد
      Object.keys(where).forEach((key) => {
        users = users.filter((u) => u[key] !== where[key]);
      });
    }
    db.data.users = users;
    await db.write();
    return;
  },

  /**
   * شبیه Sequelize.update
   * data: مقادیری که می‌خواهیم به‌روزرسانی شوند
   * where: شرط برای یافتن رکورد(های) مورد نظر
   * این متد تنها نمونه‌ای ساده است که برای Update پروفایل کاربرد دارد.
   */
  update: async (data, { where }) => {
    const users = await getUsers();
    let updated = null;
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      // شرط ساده برای id یا سایر فیلدهای where
      let matches = true;
      Object.keys(where).forEach((key) => {
        if (u[key] !== where[key]) matches = false;
      });
      if (matches) {
        // اعمال تغییرات
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
