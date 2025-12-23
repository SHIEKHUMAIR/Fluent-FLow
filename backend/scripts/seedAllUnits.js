const { spawn } = require("child_process");
const path = require("path");

async function seedAllUnits() {
  console.log("📦 Starting to seed all units...\n");

  const units = [1, 2, 3, 4, 5, 6];
  
  for (const unitNumber of units) {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`Seeding Unit ${unitNumber}...`);
    console.log(`${"=".repeat(50)}\n`);

    await new Promise((resolve, reject) => {
      const seedUnit = spawn("node", [path.join(__dirname, "seedUnit.js"), unitNumber.toString()], {
        stdio: "inherit",
        cwd: __dirname
      });

      seedUnit.on("close", (code) => {
        if (code === 0) {
          console.log(`\n✅ Unit ${unitNumber} completed successfully\n`);
          resolve();
        } else {
          console.error(`\n❌ Unit ${unitNumber} failed with code ${code}\n`);
          reject(new Error(`Unit ${unitNumber} seeding failed`));
        }
      });

      seedUnit.on("error", (err) => {
        console.error(`\n❌ Error seeding unit ${unitNumber}:`, err);
        reject(err);
      });
    });
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 All units seeded successfully!");
  console.log("=".repeat(50) + "\n");
  process.exit(0);
}

seedAllUnits().catch((error) => {
  console.error("❌ Error seeding units:", error);
  process.exit(1);
});

