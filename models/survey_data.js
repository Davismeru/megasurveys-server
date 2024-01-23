module.exports = (Sequelize, DataTypes) => {
  const survey_data = Sequelize.define(
    "survey_data",
    {
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      questionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      selectedOption: DataTypes.STRING,
      uploadType: DataTypes.STRING,
      acceptedOptions: DataTypes.STRING,
      optionsList: DataTypes.STRING,
    },
    { timestamps: false }
  );

  return survey_data;
};
