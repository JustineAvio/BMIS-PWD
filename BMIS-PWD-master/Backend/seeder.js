const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const env = require('dotenv').config().parsed || {};
const dbConfig = {
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER,
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME
};

async function seedDatabase() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        console.log("--- Starting Seeder ---");

        // 1. Disable Foreign Keys to clear tables safely
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE accounttable');
        await connection.query('TRUNCATE TABLE residenttable');
        await connection.query('TRUNCATE TABLE persontable');
        await connection.query('TRUNCATE TABLE applicationtable');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log("✔ Tables cleared and IDs reset.");

        const hashedAdminPass = await bcrypt.hash('admin123', 10);
        const hashedUserPass = await bcrypt.hash('user123', 10);

        // 2. Create Admin (Person -> Resident -> Account)
        const [adminPerson] = await connection.query(
            "INSERT INTO persontable (GivenName, LastName, Sex, Birthday, is_PWD) VALUES (?, ?, ?, ?, ?)",
            ['System', 'Administrator', 'Male', '1990-01-01', 'No']
        );
        
        const [adminResident] = await connection.query(
            "INSERT INTO residenttable (PersonID, Address, ContactNo, RegistrationDate) VALUES (?, ?, ?, NOW())",
            [adminPerson.insertId, 'Barangay Hall', '09123456789']
        );

        await connection.query(
            "INSERT INTO accounttable (username, password, email, role, ResidentID) VALUES (?, ?, ?, ?, ?)",
            ['admin', hashedAdminPass, 'admin@barangay.gov.ph', 'admin', adminResident.insertId]
        );
        console.log("✔ Admin Account created (User: admin / Pass: admin123)");

        // 3. Create a Test Resident
        const [resPerson] = await connection.query(
            "INSERT INTO persontable (GivenName, LastName, Sex, Birthday, is_PWD) VALUES (?, ?, ?, ?, ?)",
            ['Juan', 'Dela Cruz', 'Male', '1995-05-20', 'No']
        );

        const [resResident] = await connection.query(
            "INSERT INTO residenttable (PersonID, Address, ContactNo, RegistrationDate) VALUES (?, ?, ?, NOW())",
            [resPerson.insertId, '123 Maple St. Subd.', '09987654321']
        );

        await connection.query(
            "INSERT INTO accounttable (username, password, email, role, ResidentID) VALUES (?, ?, ?, ?, ?)",
            ['juan_test', hashedUserPass, 'juan@example.com', 'resident', resResident.insertId]
        );
        console.log("✔ Test Resident created (User: juan_test / Pass: user123)");

        console.log("--- Seeding Complete! ---");

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await connection.end();
    }
}

seedDatabase();