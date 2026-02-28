const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const setup = async () => {
  try {
    console.log('🔧 Setting up UniTracker Database...\n');

    // First, connect without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
    });

    console.log('✅ Connected to MySQL server\n');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        await connection.query(statement);
        console.log(`✓ Executed: ${statement.substring(0, 60)}...`);
      } catch (error) {
        console.log(`⚠ Statement: ${statement.substring(0, 60)}...`);
        console.log(`  Error: ${error.message}\n`);
      }
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('📦 Database: unitracker');
    console.log('📋 Tables: users, expenses, savings_goals\n');

    await connection.end();
  } catch (error) {
    console.error('\n❌ Database setup failed:');
    console.error(`Error: ${error.message}\n`);
    console.error('Troubleshooting:');
    console.error('1. Make sure MySQL is running');
    console.error('2. Check .env file credentials');
    console.error('3. Verify DB_HOST, DB_USER, DB_PASSWORD\n');
    process.exit(1);
  }
};

setup();
