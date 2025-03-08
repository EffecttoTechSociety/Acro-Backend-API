const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: true,  // Adds `created_at` and `updated_at`
    paranoid: true     // Enables soft delete (`deleted_at`)
});

module.exports = Role;
