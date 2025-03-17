const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0,
});

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Lỗi kết nối MySQL:", err.message);
  } else {
    console.log("Kết nối MySQL thành công!");
    connection.release();
  }
});

module.exports = pool.promise();
