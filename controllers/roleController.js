const { Role, User } = require("../models");

// SET PRIMARY ROLE
exports.setPrimaryRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId, { include: Role });
    if (!user) return res.status(404).json({ error: "User not found" });

    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });

    // Set all existing roles for the user to `is_primary = false`
    await Role.update(
      { is_primary: false },
      { where: { id: user.Roles.map((r) => r.id) } }
    );

    // Set the new role as primary
    await Role.update({ is_primary: true }, { where: { id: roleId } });

    res.status(200).json({ message: `Primary role set to ${role.name}` });
  } catch (error) {
    console.error("Error setting primary role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Find the role
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });

    // Check if the user actually has this role
    const userRoles = await user.getRoles({ where: { id: roleId } });
    if (userRoles.length === 0) {
      return res.status(400).json({ error: "User does not have this role" });
    }

    // Remove the role from the user (only deletes from UserRole table)
    await user.removeRole(role);

    res.status(200).json({ message: "Role removed from user successfully" });
  } catch (error) {
    console.error("Error removing role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addRoles = async (req, res) => {
  try {
    const { userId, roles } = req.body; // Accepts multiple role names

    // Find the user and include current roles
    const user = await User.findByPk(userId, { include: Role });
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("Roles requested:", roles);

    // Get existing roles of the user
    const existingRoles = await user.getRoles();
    const existingRoleNames = existingRoles.map((role) => role.name);

    console.log("Existing roles:", existingRoleNames);

    // Filter out roles that the user already has
    const rolesToAdd = roles.filter(
      (roleName) => !existingRoleNames.includes(roleName)
    );

    console.log("Roles to add:", rolesToAdd);

    if (rolesToAdd.length > 0) {
      // Restore soft-deleted roles if they exist
      await Role.restore({ where: { name: rolesToAdd } });

      // Fetch roles again after restoring
      const newRoles = await Role.findAll({
        where: { name: rolesToAdd },
      });

      console.log(
        "Fetched new roles after restore:",
        newRoles.map((r) => r.name)
      );

      if (newRoles.length > 0) {
        await user.addRoles(newRoles);

        // 🔹 Update `UserRole` table to set `is_primary: false` for new roles
        for (const role of newRoles) {
          await role.update(
            { is_primary: false },
            { where: { UserId: userId, RoleId: role.id } }
          );
        }
      }
    }

    res.status(200).json({ message: "Roles added successfully" });
  } catch (error) {
    console.error("Error adding roles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
