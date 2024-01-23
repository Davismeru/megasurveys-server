const { survey_details } = require("../models");

module.exports = (Sequelize, DataTypes) => {
  const clients = Sequelize.define("clients", {
    userName: DataTypes.STRING,
    affiliate: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
  });

  clients.associate = (models) => {
    clients.hasMany(models.survey_details);
  };

  return clients;
};
