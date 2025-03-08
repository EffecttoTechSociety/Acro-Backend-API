const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Import User model
const Role = require('./Role'); // Import Role model

const UserRole = sequelize.define('UserRole', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true,  // Adds `created_at` and `updated_at`
    paranoid: true     // Enables soft delete (`deleted_at`)
});

// Define Many-to-Many Relationship
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id' });

module.exports = UserRole;
