"use strict";
module.exports = (sequelize, DataTypes) => {
  const watchlists = sequelize.define(
    "watchlists",
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      released: DataTypes.DATE,
      image: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      genre: DataTypes.STRING,
    },
    {}
  );
  watchlists.associate = function (models) {
    watchlists.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return watchlists;
};
