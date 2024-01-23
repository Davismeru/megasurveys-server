const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/clientAuthMiddleware");

//controllers
const {
  clientSignUp,
  confirmUserName,
  clientSignIn,
  createSurvey,
  upload,
  getClientSurveys,
  getResponses,
  getFreelancer,
  deleteSurvey,
} = require("../controllers/clientController");

// sign up route
router.post("/signup", upload, clientSignUp);

// confirm username during signup route
router.post("/find/:username", confirmUserName);

// sign in route
router.post("/signin", clientSignIn);

// create survey route
router.post("/create_survey", createSurvey);

// get all client's surveys
router.get("/get_surveys/:clientId", getClientSurveys);

// get selected survey responses
router.get("/get_responses/:surveyId", getResponses);

// get client details for a specific response
router.get("/get_freelancer/:freelancerId", getFreelancer);

// delete survey
router.post("/delete_survey/:surveyId", deleteSurvey);

// confirm json web token validity route
router.post("/checkAuth", validateToken);

module.exports = router;
