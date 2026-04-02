const pdfParse = require("pdf-parse");
const { generateInterViewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * 
 * @description Controller to generate interview report based on user self description, resume and job
 */

async function generateInterViewReportController(req, res) {
    try {
        // Validation: Bina file ke aage nahi badhega
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "Resume PDF missing hai bhai!" });
        }

        const { selfDescription, jobDescription } = req.body;

        // TERA ORIGINAL PDF PARSE LOGIC (Jo tere version me sahi chal raha tha)
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();

        // Agar getText() seedha string deta hai toh direct use karenge, warna .text nikalenge
        const resumeText = typeof resumeContent === 'string' ? resumeContent : resumeContent.text;

        // AI Service ko call kar rahe hain
        let interViewReportByAi = await generateInterViewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        // Agar AI fail ho jaye (jaise limit hit hone par)
        if (!interViewReportByAi) {
            return res.status(500).json({ message: "AI ne report generate nahi ki. Error logs check kar." });
        }

        // YEH HAI TERA MAIN BUG FIX 🚀
        // AI string bhejta hai (kabhi-kabhi markdown backticks ke sath), usko Object banana padega
        if (typeof interViewReportByAi === 'string') {
            try {
                // Agar Gemini ne ```json aur ``` laga kar bheja hai, toh usko clean karo
                const cleanJsonString = interViewReportByAi.replace(/```json/g, "").replace(/```/g, "").trim();
                interViewReportByAi = JSON.parse(cleanJsonString);
            } catch (err) {
                console.log("JSON Parse Error: AI ne galat format bheja -", err);
                return res.status(500).json({ message: "AI data formatting error." });
            }
        }

        // DB mein save kar rahe hain
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi // Ab yeh ek proper Object hai, toh saare arrays perfectly save honge!
        });

        // Sahi tareeka response bhejne ka (res.status aur return ke sath)
        return res.status(201).json({
            message: "Interview Report Generated Successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

/**
 * 
 * @description Controller to get interview report by interviewId.
 */

async function getInterViewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {

    }
}

/**
 *  @description Controller to get all interview reports of logged in user.
 */

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        })
    } catch (error) {

    }
}

/**
 *  @description Controller to generate resume pdf from html.
 */

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const {resume, jobDescription, selfDescription} = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterViewReportByIdController, getAllInterviewReportsController, generateResumePdfController };