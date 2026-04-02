const mongoose = require('mongoose')

const technicalQuestionsSchema = new mongoose.Schema({
    questions: { // 's' add kiya (Zod se match karne ke liye)
        type: String,
        required: [true, "technical question is required"] // 'd' add kiya
    },
    intention: {
        type: String,
        required: [true, "intention is required"] // 'd' add kiya
    },
    answer: {
        type: String,
        required: [true, "Answer is required"] // 'd' add kiya
    }
}, { _id: false })

const behavioralQuestionsSchema = new mongoose.Schema({ // 'u' hataya (behavioral kiya)
    questions: { // 's' add kiya
        type: String,
        required: [true, "behavioral question is required"]
    },
    intention: {
        type: String,
        required: [true, "intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, { _id: false })

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
}, { _id: false })

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{ // 's' add kiya
        type: String,
        required: [true, "Task is required"]
    }]
}, { _id: false }) // Sub-schemas mein _id false karna best practice hai

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema], // 'u' hataya
    skillGaps: [skillGapSchema], // 's' add kiya
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [true, "Job title is required"],
        default: "Software Engineering Interview" // Default daal diya taaki error na aaye
    }
}, {
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;