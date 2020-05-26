'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        first: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            isEmail: true
        }
    }, {});

    User.associate = function(models) {
        // associations can be defined here
        User.hasMany(models.AuthToken)
    };
    return User;
};