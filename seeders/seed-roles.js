const sequelize = require("../config/db");
const Role = require("../models/Role");

const seedRoles = async () => {
  await sequelize.sync(); // Ensure the database is connected

  const roles = ["admin", "consumer", "manufacturer"]; // Define your roles

  for (const roleName of roles) {
    await Role.findOrCreate({ where: { name: roleName } });
  }

  console.log("Roles have been seeded.");
  process.exit(); // Exit the script
};

seedRoles();
