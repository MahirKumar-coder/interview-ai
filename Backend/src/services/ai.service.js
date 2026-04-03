const { GoogleGenAI } = require('@google/genai');
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Tera Zod schema ekdum same aur perfect hai
const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 to 100 indicating  how well the candidate's profile matches the job description."),
  technicalQuestions: z.array(z.object({
    questions: z.string().describe("The technical question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe("Technical questions that can be asked in the interview along with their intention and how to ans them."),
  behavioralQuestions: z.array(z.object({
    questions: z.string().describe("The technical question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe("Behavioral questions that can be asked in the interview along with their intention and how to ans them."),
  skillGaps: z.array(z.object({
    skill: z.string().describe("The skill which the candidate is lacking"),
    severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e how important the skill is for the job")
  })).describe("List of skill gaps in the candidate's profile along with their severity"),
  preparationPlan: z.array(z.object({
    day: z.number().describe("The day number in the preparation plan, starting from 1"),
    focus: z.string().describe("The main focus of this day in the preparation plan, e.g data structures, system design, mock interviews"),
    tasks: z.array(z.string()).describe("List of task to be done on this day to follow the preparation plan, e.g. read a specific book pr")
  })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
  title: z.string().describe("The title of the job for which the interview report is generated")
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateInterViewReport({ resume, selfDescription, jobDescription }) {

  // YAHAN HUMNE AI KO EXACT JSON STRUCTURE DE DIYA HAI
  const prompt = `You are an expert tech interviewer. I will provide you with a Job Description and a Candidate's details.
Analyze them and generate a comprehensive interview preparation report.

Job Description: ${jobDescription}
Candidate Resume: ${resume}
Candidate Self Description: ${selfDescription}

CRITICAL INSTRUCTION: You MUST return the output EXACTLY as a valid JSON object. Do NOT add any markdown formatting like \`\`\`json or backticks. 
The JSON object MUST strictly follow this exact structure and key names. DO NOT change the spellings of any keys:

{
  "matchScore": 85,
  "title": "Role name from Job Description",
  "technicalQuestions": [
    {
      "questions": "Write the technical question here.",
      "intention": "What are you trying to test?",
      "answer": "Provide a brief ideal answer."
    }
  ],
  "behavioralQuestions": [
    {
      "questions": "Write the behavioral question here.",
      "intention": "What soft skill is being tested?",
      "answer": "Provide an ideal approach."
    }
  ],
  "skillGaps": [
    {
      "skill": "Name of the missing skill",
      "severity": "high" // MUST be exactly "low", "medium", or "high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Main topic for the day",
      "tasks": [
        "Task 1 string",
        "Task 2 string"
      ]
    }
  ]
}`;

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Gemini API ko request bhej rahe hain...`);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Stable model
        contents: prompt,
        config: {
          responseMimeType: "application/json"
          // Zod schema hata diya, ab seedha prompt se control hoga!
        }
      });

      console.log("Success! Report generate ho gayi.");

      const responseText = response.text;
      console.log("Gemini ne EXACTLY yeh JSON bheja:\n", responseText);

      const parsedData = JSON.parse(responseText);
      return parsedData;

    } catch (error) {
      if (error.status === 429 || error.status === 503 || (error.message && (error.message.includes("429") || error.message.includes("503")))) {
        console.error(`Attempt ${attempt} fail ho gaya (API busy).`);

        if (attempt === maxRetries) {
          console.error("Bhai saare retries try kar liye par API busy hai. Thodi der baad manually try kar.");
          break;
        }

        console.log("35 seconds ka wait kar rahe hain automatic retry se pehle...");
        await delay(35000);

      } else {
        console.error("Backend mein koi aur error aaya:", error);
        break;
      }
    }
  }
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true, // Server par headless true hona zaroori hai
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // 👇 YEH SABSE ZAROORI HAI RENDER KE LIYE
      '--disable-gpu'
    ]
  })
  const page = await browser.newPage()
  await page.setContent(htmlContent, { waitUntil: "networkidle0" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" }
  })

  await browser.close()

  return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

  const resumePdfSchema = z.object({
    html: z.string().describe("The resume in HTML format, with proper styling and formatting for a resume ")
  })

  const prompt = `Generate a professional resume for a candidate. Combine the candidate's original resume, their self description, and tailor it specifically for the job description.
  
  Resume: ${resume}
  Self Description: ${selfDescription}
  Job Description: ${jobDescription}

  CRITICAL INSTRUCTION: You MUST return the output EXACTLY as a valid JSON object. 
  The JSON object MUST strictly contain only one key "html" which contains a fully styled, beautifully formatted complete HTML document (using inline CSS or internal <style> tags).
  Ensure the HTML is visually appealing, professional, and ready to be printed to PDF.

  {
    "html": "<!DOCTYPE html><html><head><style>body { font-family: Arial, sans-serif; }</style></head><body>...</body></html>"
  }
    The resume should be in a single page.
    The content of resume should be not sound like AI generated.
    You can highlight the key skills and achievements of the candidate.
    Do not add any extra information that is not present in the resume.
    The content should be not more than 500 words.
    The resume should be in a professional format.
  `

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema)
    }
  })

  let jsonContent;
  const responseText = response.text;

  try {
    const cleanJsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    jsonContent = JSON.parse(cleanJsonString);
  } catch (err) {
    console.log("JSON Parse Error: AI sent invalid format -", responseText);
    jsonContent = { html: "<h1>Error: AI did not return valid JSON</h1><pre>" + responseText + "</pre>" };
  }

  const htmlContent = jsonContent.html || jsonContent.HTML || "<h1>Error: Missing 'html' key in AI response</h1>";

  const pdfBuffer = await generatePdfFromHtml(htmlContent)

  return pdfBuffer
}

module.exports = { generateInterViewReport, generateResumePdf };