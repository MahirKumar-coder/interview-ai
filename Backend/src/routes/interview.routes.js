const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interViewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 *  @Route POST api/interview/
 *  @description generate new interview report on the basis of user self description, resume pdf and job description.
 *  @access private
 */

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interViewController.generateInterViewReportController)

/**
 *  @route GET /api/interview/report/:interviewId
 *  @description get interview report by interviewId.
 *  @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interViewController.getInterViewReportByIdController)

/**
 *  @route GET /api/interview/
 *  @description get all interview reports of logged in user.
 *  @access private
 */

interviewRouter.get("/", authMiddleware.authUser, interViewController.getAllInterviewReportsController)

/**
 *  @route GET /api/interview/resume/pdf/:interviewReportId
 *  @description generate resume pdf on the basis of user self description and job description.
 *  @access private
 */

interviewRouter.get("/resume/pdf/:interviewReportId", authMiddleware.authUser, interViewController.generateResumePdfController)

module.exports = interviewRouter