const express = require("express");
const router = express.Router();

const validateToken = require("../middlewares/freelancerAuthMiddleware");

// controllers
const {
  upload,
  freelancerSignUp,
  confirmUserName,
  freelancerSignIn,
  getAllSurveys,
  getSurveyData,
  postSurveyResponse,
  upload_files,
  getClient,
} = require("../controllers/freelancerController");

// sign up route
router.post("/signup", upload, freelancerSignUp);

// confirm username during signup route
router.post("/find/:username", confirmUserName);

// sign in route
router.post("/signin", freelancerSignIn);

// get all surveys
router.get("/get_surveys/:freelancerId", getAllSurveys);

// get selected survey and its data (questions and response option)
router.get("/get_survey/:surveyId", getSurveyData);

// post survey response router
router.post("/post_response", upload_files, postSurveyResponse);

// get get client's details for a specific survey
router.get("/get_client/:clientId", getClient);

// confirm json web token validity route
router.post("/checkAuth", validateToken, (req, res) => {
  // const user = req.user;
  // res.json(user);
});

module.exports = router;
