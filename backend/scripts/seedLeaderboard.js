const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { connectDB, getPool } = require("../source/configuration/dbConfig");
const User = require("../source/models/User");
const UserStats = require("../source/models/UserStats");
const UserActivity = require("../source/models/UserActivity");
const bcrypt = require("bcrypt");

// Sample first and last names for generating users
const firstNames = [
  "Amna", "Bilal", "Ali", "Fatima", "Hassan", "Sara", "Ahmed", "Zainab",
  "Usman", "Ayesha", "Omar", "Maryam", "Hamza", "Aisha", "Yusuf", "Khadija",
  "Ibrahim", "Hafsa", "Muhammad", "Amina", "Tariq", "Noor", "Khalid", "Layla"
];

const lastNames = [
  "Ahmed", "Ali", "Hassan", "Khan", "Malik", "Raza", "Shah", "Waqar",
  "Saleem", "Iqbal", "Butt", "Sheikh", "Abbas", "Hussain", "Rehman", "Yousuf"
];

// Activity types and their XP values
const activityTypes = [
  { type: "lesson_completed", description: "Completed lesson", xp: 50 },
  { type: "vocabulary_practice", description: "Practiced vocabulary", xp: 10 },
  { type: "quiz_completed", description: "Completed quiz", xp: 25 },
  { type: "streak_bonus", description: "Daily streak bonus", xp: 15 },
  { type: "achievement_unlocked", description: "Unlocked achievement", xp: 100 },
  { type: "perfect_score", description: "Got perfect score", xp: 30 },
  { type: "review_completed", description: "Completed review", xp: 20 }
];

// Generate random date within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate random number between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create or get users
async function getOrCreateUsers(count = 15) {
  const pool = getPool();
  const users = [];
  
  // Get existing users
  const existingUsersResult = await pool.query("SELECT * FROM users ORDER BY id");
  const existingUsers = existingUsersResult.rows;
  
  console.log(`📋 Found ${existingUsers.length} existing users`);
  
  // Use existing users first
  for (const user of existingUsers) {
    users.push(user);
  }
  
  // Create additional users if needed
  const usersToCreate = count - existingUsers.length;
  if (usersToCreate > 0) {
    console.log(`👥 Creating ${usersToCreate} new users...`);
    
    for (let i = 0; i < usersToCreate; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
      const password = await bcrypt.hash("password123", 10);
      
      const result = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, created_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         RETURNING *`,
        [firstName, lastName, email, password]
      );
      
      users.push(result.rows[0]);
      console.log(`  ✓ Created user: ${firstName} ${lastName}`);
    }
  }
  
  return users;
}

// Generate activities for a user
async function generateActivitiesForUser(userId, daysBack = 30) {
  const pool = getPool();
  const now = new Date();
  const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  
  // Generate 5-30 activities per user
  const activityCount = randomInt(5, 30);
  const activities = [];
  
  for (let i = 0; i < activityCount; i++) {
    const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const createdAt = randomDate(startDate, now);
    
    // Insert activity
    const result = await pool.query(
      `INSERT INTO user_activity (user_id, activity_type, activity_description, xp_earned, created_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, activity.type, activity.description, activity.xp, createdAt]
    );
    
    activities.push(result.rows[0]);
  }
  
  return activities;
}

// Update user stats based on activities
async function updateUserStats(userId) {
  const pool = getPool();
  
  // Calculate total XP from all activities
  const xpResult = await pool.query(
    `SELECT COALESCE(SUM(xp_earned), 0) as total_xp,
            COUNT(*) as activity_count
     FROM user_activity
     WHERE user_id = $1`,
    [userId]
  );
  
  const totalXp = parseInt(xpResult.rows[0].total_xp) || 0;
  const activityCount = parseInt(xpResult.rows[0].activity_count) || 0;
  
  // Calculate lessons completed (assuming 1 lesson = 50 XP)
  const lessonsCompleted = Math.floor(totalXp / 50);
  
  // Calculate streak (random between 0 and 30, but make it realistic)
  const currentStreak = randomInt(0, Math.min(30, Math.floor(activityCount / 2)));
  const longestStreak = Math.max(currentStreak, randomInt(0, 45));
  
  // Calculate study time (assume 5-15 minutes per activity)
  const studyTimeMinutes = activityCount * randomInt(5, 15);
  
  // Get last study date
  const lastStudyResult = await pool.query(
    `SELECT MAX(created_at) as last_study
     FROM user_activity
     WHERE user_id = $1`,
    [userId]
  );
  
  const lastStudyDate = lastStudyResult.rows[0]?.last_study 
    ? new Date(lastStudyResult.rows[0].last_study).toISOString().split('T')[0]
    : null;
  
  // Initialize or update user stats
  await UserStats.initialize(userId);
  
  // Set total XP directly (not add to it) by using raw SQL
  await pool.query(
    `UPDATE user_stats 
     SET total_xp = $1,
         lessons_completed = $2,
         study_time_minutes = $3,
         current_streak = $4,
         longest_streak = $5,
         last_study_date = $6,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $7`,
    [totalXp, lessonsCompleted, studyTimeMinutes, currentStreak, longestStreak, lastStudyDate, userId]
  );
  
  return {
    totalXp,
    lessonsCompleted,
    studyTimeMinutes,
    currentStreak,
    longestStreak
  };
}

// Main seed function
async function seedLeaderboard() {
  try {
    await connectDB();
    console.log("🌱 Starting leaderboard data seed...\n");
    
    // Get or create users (15 users total)
    const users = await getOrCreateUsers(15);
    console.log(`\n📊 Generating activities for ${users.length} users...\n`);
    
    // Generate activities for each user with different time distributions
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userName = `${user.first_name} ${user.last_name}`;
      
      // Distribute activities across different time periods
      let daysBack;
      if (i < 3) {
        // First 3 users: activities in last 7 days (this week)
        daysBack = 7;
      } else if (i < 8) {
        // Next 5 users: activities in last 30 days (this month)
        daysBack = 30;
      } else {
        // Remaining users: activities in last 90 days (all time)
        daysBack = 90;
      }
      
      console.log(`  📝 Generating activities for ${userName} (last ${daysBack} days)...`);
      
      // Clear existing activities for this user (optional - comment out if you want to keep existing)
      // await pool.query("DELETE FROM user_activity WHERE user_id = $1", [user.id]);
      
      // Generate activities
      const activities = await generateActivitiesForUser(user.id, daysBack);
      
      // Update user stats
      const stats = await updateUserStats(user.id);
      
      console.log(`    ✓ Created ${activities.length} activities, Total XP: ${stats.totalXp}, Streak: ${stats.currentStreak} days\n`);
    }
    
    console.log("✅ Leaderboard data seed completed successfully!");
    console.log("\n📈 Summary:");
    console.log(`   - ${users.length} users`);
    console.log(`   - Activities distributed across different time periods`);
    console.log(`   - User stats updated with XP, streaks, and lessons completed`);
    console.log("\n💡 You can now view the leaderboard with:");
    console.log("   - This Week: Top users with recent activity");
    console.log("   - This Month: Users active in the last 30 days");
    console.log("   - All Time: Complete leaderboard");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding leaderboard data:", error);
    process.exit(1);
  }
}

// Run the seed
seedLeaderboard();

