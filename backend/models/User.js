const db = require("../config/db");

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  static async create({ username, email, password, avatar }) {
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)",
      [username, email, password, avatar || "/default-avatar.jpg"]
    );
    return result.insertId;
  }
}

module.exports = User;
