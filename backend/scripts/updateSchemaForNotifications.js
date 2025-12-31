require('dotenv').config();
const { getPool, connectDB } = require("../source/configuration/dbConfig");

const updateSchema = async () => {
  await connectDB();
  const pool = getPool();
  
  try {
    console.log("Updating schema for push notifications...");

    // Add notification_time column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS notification_time VARCHAR(5),
      ADD COLUMN IF NOT EXISTS timezone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS push_subscription TEXT;
    `);

    console.log("Schema updated successfully.");
  } catch (error) {
    console.error("Error updating schema:", error);
  } finally {
    // Close the pool via process exit or let it drain if script is standalone
    process.exit();
  }
};

updateSchema();
