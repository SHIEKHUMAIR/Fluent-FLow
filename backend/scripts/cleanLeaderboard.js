const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { connectDB, getPool } = require("../source/configuration/dbConfig");

async function cleanLeaderboard() {
  try {
    await connectDB();
    const pool = getPool();
    console.log("🧹 Starting leaderboard cleanup...\n");

    // Delete users with email ending in @example.com
    // Use CASCADE delete if foreign keys are set up, but to be safe/explicit:
    
    // 1. Find the users
    const usersResult = await pool.query("SELECT id, email FROM users WHERE email LIKE '%@example.com'");
    const users = usersResult.rows;

    if (users.length === 0) {
      console.log("✅ No dummy users found to clean up.");
      process.exit(0);
    }

    console.log(`Found ${users.length} dummy users to delete.`);
    const userIds = users.map(u => u.id);

    // 2. Delete user activities
    const activityResult = await pool.query("DELETE FROM user_activity WHERE user_id = ANY($1)", [userIds]);
    console.log(`  - Deleted ${activityResult.rowCount} activity records`);

    // 3. Delete user stats
    const statsResult = await pool.query("DELETE FROM user_stats WHERE user_id = ANY($1)", [userIds]);
    console.log(`  - Deleted ${statsResult.rowCount} stats records`);

    // 4. Delete the users
    const deleteResult = await pool.query("DELETE FROM users WHERE id = ANY($1)", [userIds]);
    console.log(`  - Deleted ${deleteResult.rowCount} users`);

    console.log("\n✅ Leaderboard cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error cleaning leaderboard:", error);
    process.exit(1);
  }
}

cleanLeaderboard();
