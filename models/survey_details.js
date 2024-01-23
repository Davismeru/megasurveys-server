const { clients } = require("../models");

module.exports = (Sequelize, DataTypes) => {
  const survey_details = Sequelize.define(
    "survey_details",
    {
      surveyId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },

      surveyTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { foreignKey: "surveyId" }
  );

  survey_details.associate = (models) => {
    survey_details.belongsTo(models.clients);
  };

  survey_details.associate = (models) => {
    survey_details.hasMany(models.survey_data, {
      onDelete: "cascade",
    });
  };

  return survey_details;
};
