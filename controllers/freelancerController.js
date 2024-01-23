const multer = require("multer");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const {
  freelancers,
  survey_details,
  survey_data,
  survey_responses,
  clients,
} = require("../models");

// profile picture upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/freelancer_profile_pictures");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.floor(Math.random() * 10000);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");

// survey response files upload
const response_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/survey_response_uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.floor(Math.random() * 10000);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload_files = multer({ storage: response_storage }).array("files");

// freelancer sign up
const freelancerSignUp = async (req, res) => {
  const { userName, email, password } = req.body;
  const profilePicture = req.file.path;

  await bcrypt.hash(password, saltRounds).then(function (hash) {
    freelancers.create({
      userName: userName,
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
  const user = await freelancers.findOne({ where: { userName: username } });

  !user ? res.json("success") : res.json({ error: "username already taken" });
};

// freelancer sign in
const freelancerSignIn = async (req, res) => {
  const { userName, password } = req.body;
  const user = await freelancers.findOne({ where: { userName: userName } });
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

// get all available surveys
const getAllSurveys = async (req, res) => {
  const { orderBy = "createdAt", sortBy = "desc" } = req.query;
  const freelancerId = req.params.freelancerId;

  const responses = await survey_responses.findAll({
    where: { freelancerId: freelancerId },
  });

  const responsesIds = [];
  responses.forEach((response) => {
    responsesIds.push(response.surveyId);
  });

  const reducedIds = [...new Set(responsesIds)];

  const surveyDetails = await survey_details.findAll({
    order: [[orderBy, sortBy]],
  });
  const data = surveyDetails.filter((item) => {
    if (!reducedIds.includes(item.surveyId)) {
      return item;
    }
  });

  res.json(data);
};

// get selected survey with data (questions and response options)
const getSurveyData = async (req, res) => {
  const surveyId = req.params.surveyId;
  const surveys = await survey_details.findOne({
    where: { surveyId: surveyId },
    include: [survey_data],
  });
  res.json(surveys);
};

// post survey response
const postSurveyResponse = async (req, res) => {
  const {
    surveyId,
    question,
    questionId,
    textResponse,
    singleOption,
    multipleOptions,
    userId,
  } = req.body;
  const files = req.files;
  const arr = [];
  files.forEach((file) => {
    arr.push(file.path);
  });

  await survey_responses.create({
    freelancerId: userId,
    surveyId: surveyId,
    question: question,
    questionId: questionId,
    textResponse: textResponse,
    singleOption: singleOption,
    multipleOptions: multipleOptions,
    surveyUploads: arr.toString(),
  });
  res.json(req.body);
};

// get clients details for a specific survey (for the survey card)
const getClient = async (req, res) => {
  const clientId = req.params.clientId;
  const client = await clients.findOne({
    where: { id: clientId },
    attributes: {
      exclude: ["password", "email", "id"],
    },
  });
  res.json(client);
};

module.exports = {
  upload,
  freelancerSignUp,
  confirmUserName,
  freelancerSignIn,
  getAllSurveys,
  getSurveyData,
  postSurveyResponse,
  getClient,
  upload_files,
};
