const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const {
  clients,
  freelancers,
  survey_details,
  survey_data,
  survey_responses,
} = require("../models");

// image upload functionality
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/client_profile_pictures");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.floor(Math.random() * 10000);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");

// sign up function
const clientSignUp = async (req, res) => {
  const { userName, email, password, affiliate, file } = req.body;
  const profilePicture = req.file.path;

  await bcrypt.hash(password, saltRounds).then(function (hash) {
    clients.create({
      userName: userName,
      affiliate: affiliate,
      email: email,
      password: hash,
      profilePicture: profilePicture,
    });
  });

  res.json("success");
};

// confirm username during sign up
const confirmUserName = async (req, res) => {
  const username = req.params.username;
  console.log(username);
  const user = await clients.findOne({ where: { userName: username } });

  !user ? res.json("success") : res.json({ error: "username already taken" });
};

// sign in function
const clientSignIn = async (req, res) => {
  const { userName, password } = req.body;
  const user = await clients.findOne({ where: { userName: userName } });
  if (!user) {
    res.json({ error: `user with username ${userName} don't exist` });
  } else {
    bcrypt.compare(password, user.password).then(function (result) {
      if (!result) {
        res.json({ error: "incorrect password" });
      } else {
        const token = jwt.sign(
          {
            id: user.id,
            userName: user.userName,
            affiliate: user.affiliate,
            email: user.email,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
          },
          "accessToken"
        );

        res.json(token);
      }
    });
  }
};

// create survey function
const createSurvey = (req, res) => {
  const data = req.body;
  const surveyData = data[0].map((data) => {
    return data;
  });

  const surveyDetails = data[1];
  survey_details.create(surveyDetails).then(() => {
    survey_data.bulkCreate(surveyData);
  });
  res.json(data);
};

// get all client's surveys
const getClientSurveys = async (req, res) => {
  const clientId = req.params.clientId;
  const { orderBy = "createdAt", sortBy = "desc" } = req.query;
  const surveys = await survey_details.findAll({
    where: { clientId: clientId },
    order: [[orderBy, sortBy]],
  });
  res.json(surveys);
};

// get selected surveys responses
const getResponses = async (req, res) => {
  const surveyId = req.params.surveyId;
  const responses = await survey_responses.findAll({
    where: { surveyId: surveyId },
  });

  // group responses by the freelancer Id
  let groupedById = Object.values(
    responses.reduce((acc, current) => {
      acc[current.freelancerId] = acc[current.freelancerId] ?? [];
      acc[current.freelancerId].push(current);
      return acc;
    }, {})
  );

  res.json(groupedById);
};

// get freelancer's details for a specific survey response
const getFreelancer = async (req, res) => {
  const freelancerId = req.params.freelancerId;
  const freelancer = await freelancers.findOne({
    where: { id: freelancerId },
    attributes: {
      exclude: ["password"],
    },
  });
  res.json(freelancer);
};

// delete survey
const deleteSurvey = async (req, res) => {
  const surveyId = req.params.surveyId;

  await survey_details.destroy({ where: { surveyId: surveyId } });

  res.send(surveyId);
};
module.exports = {
  clientSignUp,
  confirmUserName,
  clientSignIn,
  createSurvey,
  upload,
  getClientSurveys,
  getResponses,
  getFreelancer,
  deleteSurvey,
};
