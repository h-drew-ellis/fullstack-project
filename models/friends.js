"use strict";
module.exports = (sequelize, DataTypes) => {
    const Friends = sequelize.define(
        "Friends", {
            userId: DataTypes.INTEGER,
            friend: DataTypes.INTEGER,
        }, {}
    );
    Friends.associate = function(models) {
        Friends.belongsTo(models.User, {
            foreignKey: "userId",
        });
    };
    return Friends;
};