module.exports = (Sequelize, DataTypes) => {
  const survey_responses = Sequelize.define("survey_responses", {
    surveyId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    textResponse: DataTypes.STRING,
    singleOption: DataTypes.STRING,
    multipleOptions: DataTypes.STRING,
    surveyUploads: DataTypes.STRING,
  });

  survey_responses.associate = (models) => {
    survey_responses.belongsTo(models.freelancers);
  };

  return survey_responses;
};
