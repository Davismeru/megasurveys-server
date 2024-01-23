module.exports = (Sequelize, DataTypes) => {
  const freelancers = Sequelize.define("freelancers", {
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
  });

  freelancers.associate = (models) => {
    freelancers.hasMany(models.survey_responses);
  };

  return freelancers;
};
