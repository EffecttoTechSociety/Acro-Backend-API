const { Op } = require("sequelize");
const { User, Role, Address, Wishlist, Order, Cart, Product } = require("../models");
const generateToken = require("../utils/TokenGenerator");
const bcrypt = require("bcrypt");
const { sendOtp } = require("../utils/otpService");

//--------------------- USER SIGNUP -----------------------------------------------------------------------------------------------------
exports.createUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      contact,
      country_code,
      roles,
      password,
      email,
      lat,
      long,
      address,
      // wishlist,
      // orderHistory,
      // tags,
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !contact || !country_code || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      first_name,
      last_name,
      contact,
      country_code,
      password: hashedPassword,
      email,
      lat,
      long,
    });

    if (roles && roles.length > 0) {
      const roleRecords = await Role.findAll({
        where: { name: roles },
      });

      console.log(
        "Fetched roles:",
        roleRecords.map((r) => r.name)
      ); // Debugging

      if (roleRecords.length > 0) {
        await user.setRoles(roleRecords);
      }
    }

    // Add addresses if provided
    if (address && address.length > 0) {
      await Address.bulkCreate(
        address.map((addr) => ({ ...addr, userId: user.id }))
      );
    }

    // Generate JWT token
    const token = generateToken(user.id);

    const userWithAssociations = await User.findByPk(user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          through: { attributes: [] }, // Hides UserRoles join table fields
        },
        {
          model: Address, // Include user's addresses
        },
      ],
    });

    // Send Otp
    await sendOtp(email);

    // Return user details along with assigned roles
    res.status(201).json({
      msg: "User Created Successfully, Please Verify Your Email",
      user: userWithAssociations,
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle Sequelize validation errors
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res
        .status(400)
        .json({ error: error.errors.map((err) => err.message) });
    }

    // Handle other errors
    res.status(500).json({ error: "Internal server error" });
  }
};

//--------------------- USER LOGIN -------------------------------------------------------------------------------------------------------

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          through: { attributes: [] }, // Hides UserRoles join table fields
        },
        {
          model: Address, // Include user's addresses
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Remove password from user data before sending response
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    // Store the token in the response
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------- UPDATE USER ---------------------------------------------------------------------------------------------------

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      first_name,
      last_name,
      contact,
      country_code,
      email,
      lat,
      long,
      roles,
      address, // List of address with their IDs if updating
    } = req.body;

    // Find the user with roles and addresses
    const user = await User.findByPk(userId, {
      include: [Role, Address],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    await user.update({
      first_name,
      last_name,
      contact,
      country_code,
      email,
      lat,
      long,
    });

    // ✅ Preserve previous roles and add new ones
    if (roles && roles.length > 0) {
      const existingRoles = await user.getRoles(); // Get current roles
      const existingRoleNames = existingRoles.map((role) => role.name);

      const newRoles = await Role.findAll({
        where: {
          name: roles.filter(
            (roleName) => !existingRoleNames.includes(roleName)
          ), // Only new roles
        },
      });

      if (newRoles.length > 0) {
        await user.addRoles(newRoles); // Add new roles without removing existing ones
      }
    }

    // Update address (if provided)
    if (address && address.length > 0) {
      for (const addr of address) {
        if (addr.id) {
          // If address ID exists, update that address
          await Address.update(addr, { where: { id: addr.id, userId } });
        } else {
          // If no ID, create a new address
          await Address.create({ ...addr, userId });
        }
      }
    }

    // Fetch updated user details
    const updatedUser = await User.findByPk(userId, {
      include: [
        { model: Role, through: { attributes: [] } }, // Include roles
        { model: Address }, // Include address
      ],
      attributes: { exclude: ["password"] },
    });

    res.status(201).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//-------------------- DELETE USER -------------------------------------------------------------------------------------------------

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(204).json({ msg: "User deleted successfully", user: user });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteBulkUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "Invalid user IDs provided" });
    }
    await User.destroy({ where: { id: userIds } });
    res.status(204).json({ msg: "Users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//------------------------ GET USER --------------------------------------------------------------------------------------------------------------

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Role, through: { attributes: [] } }, // Include roles
        { model: Address }, // Include addresses
        { model: Wishlist }, // Include wishlist
        { model: Order }, // Include order history
        {
          model: Cart, // User cart
          include: [{ model: Product }], // Include products inside the cart
        }, // Include tags
      ],
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      include: [
        { model: Role, through: { attributes: [] } },
        { model: Address },
        { model: Wishlist },
        { model: Order },
        {
          model: Cart, // User cart
          include: [{ model: Product }], // Include products inside the cart
        },
      ],
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//--------------------- GET DELETED USER----------------------------------------------------------------------------

exports.getDeletedUsers = async (req, res) => {
  try {
    const deletedUsers = await User.findAll({
      where: { deletedAt: { [Op.not]: null } },
      include: [
        { model: Role, through: { attributes: [] } }, // Include roles
        { model: Address }, // Include addresses
      ],
      attributes: { exclude: ["password"] },
      paranoid: false,
    });
    res.status(200).json({ deletedUsers: deletedUsers });
  } catch (error) {
    console.error("Error fetching deleted users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDeletedUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByPk(userId, {
      where: { deletedAt: { [Op.not]: null } },
      include: [
        { model: Role, through: { attributes: [] } }, // Include roles
        { model: Address }, // Include addresses
      ],
      attributes: { exclude: ["password"] },
      paranoid: false,
    });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error fetching deleted user by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//---------------------- RESTORE USER -------------------------------------------------------------------------------------------------

exports.restoreUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, { paranoid: false });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.restore();
    res.status(200).json({ msg: "User restored successfully", user: user });
  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.restoreBulkUser = async (req, res) => {
  try {
    const { userIds } = req.body;

    // Ensure userIds is an array
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "Invalid user IDs provided" });
    }

    // Restore users
    const restoredUsers = await User.restore({
      where: { id: { [Op.in]: userIds } }, // Restore users where ID is in the array
      paranoid: false,
    });

    res.status(200).json({
      msg: `${userIds.length} users restored successfully`,
      restoredUsers: restoredUsers,
    });
  } catch (error) {
    console.error("Error restoring bulk users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
