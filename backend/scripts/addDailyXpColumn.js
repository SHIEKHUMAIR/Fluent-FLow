const { getPool } = require("../source/configuration/dbConfig");

async function addDailyXpColumn() {
  const pool = getPool();
  try {
    console.log("Checking for 'daily_xp' column in 'user_stats' table...");
    
    // Check if column exists
    const checkRes = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='user_stats' AND column_name='daily_xp';
    `);

    if (checkRes.rows.length === 0) {
      console.log("Adding 'daily_xp' column...");
      await pool.query(`
        ALTER TABLE user_stats 
        ADD COLUMN daily_xp INTEGER DEFAULT 0;
      `);
      console.log("Successfully added 'daily_xp' column.");
    } else {
      console.log("'daily_xp' column already exists.");
    }

  } catch (error) {
    console.error("Error adding column:", error);
  } finally {
    // We don't close the pool here because it might be shared, 
    // but for a standalone script we should probably exit
    process.exit(0);
  }
}

addDailyXpColumn();
