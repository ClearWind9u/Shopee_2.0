const db = require("../config/db");

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  static async findById(userId) {
    const [rows] = await db.execute("SELECT id, username, email, role, avatar FROM users WHERE id = ?", [userId]);
    return rows[0];
  }

  static async create({ username, email, password, role }) {
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password, role, avatar, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [username, email, password, role, "/default-avatar.jpg"]
    );
    return result.insertId;
  }

  static async updateProfile(userId, username, avatar) {
    let query = "UPDATE users SET username = ? ";
    let params = [username];

    if (avatar) {
      query += ", avatar = ? ";
      params.push(avatar);
    }

    query += "WHERE id = ?";
    params.push(userId);

    await db.execute(query, params);

    return this.findById(userId);
  }
}

module.exports = User;
