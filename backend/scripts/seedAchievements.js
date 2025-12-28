const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { connectDB, getPool } = require("../source/configuration/dbConfig");

const achievements = [
  {
    key: "first_step",
    title: "First Step",
    description: "Complete your first lesson",
    icon: "🚀",
    xpReward: 50
  },
  {
    key: "unbroken_flow",
    title: "Unbroken Flow",
    description: "Reach a 7-day streak",
    icon: "🔥",
    xpReward: 100
  },
  {
    key: "wordsmith",
    title: "Wordsmith",
    description: "Learn your first 50 words",
    icon: "📚",
    xpReward: 75
  },
  {
    key: "perfectionist",
    title: "Perfectionist",
    description: "Get a 100% score on any lesson",
    icon: "🎯",
    xpReward: 150
  },
  {
    key: "dedicated_learner",
    title: " Dedicated Learner",
    description: "Complete weekly challenge (750 XP)",
    icon: "⏱️",
    xpReward: 200
  },
  {
    key: "monthly_master",
    title: "Monthly Master",
    description: "Complete monthly challenge (2500 XP)",
    icon: "🌟",
    xpReward: 500
  }
];

async function seedAchievements() {
  try {
    await connectDB();
    const pool = getPool();
    console.log("🌱 Seeding achievements...");

    for (const achievement of achievements) {
      const result = await pool.query(
        `INSERT INTO achievements (achievement_key, title, description, icon, xp_reward, created_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
         ON CONFLICT (achievement_key) 
         DO UPDATE SET 
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            icon = EXCLUDED.icon,
            xp_reward = EXCLUDED.xp_reward
         RETURNING *`,
        [achievement.key, achievement.title, achievement.description, achievement.icon, achievement.xpReward]
      );
      console.log(`  ✓ Seeded: ${achievement.title}`);
    }

    console.log("✅ Achievements seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding achievements:", error);
    process.exit(1);
  }
}

seedAchievements();
