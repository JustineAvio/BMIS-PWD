const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seed() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'bmis_db'
  });

  const users = [
    ['Admin123', 'admin', 'admin123', 'admin123@email.com'],
    ['User123', 'resident', 'password123', 'user@email.com']
  ];

  try {
    console.log("Starting seed...");

    await connection.query('DELETE FROM accounttable');

    for (const user of users) {
      const [username, role, plainPassword, email] = user;

      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const query = "INSERT INTO accounttable (username, role, password, email) VALUES (?, ?, ?, ?)";
      await connection.query(query, [username, role, hashedPassword, email]);
      
      console.log(`Inserted user: ${username}`);
    }

    console.log("Database seeded successfully! 🌱");
  } catch (err) {
    console.error("Error seeding:", err);
  } finally {
    await connection.end();
  }
}

seed();