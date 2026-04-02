import { generateInterviewReport, getAllInterviewReports, getInterviewReportById, generateResumePdf as generateResumePdfApi } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams() 

    if (!context) {
        throw new Error("useInterview must be used within a InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            
            // Check lagaya taaki null par crash na ho
            if (response && response.interviewReport) {
                setReport(response.interviewReport)
                return response.interviewReport; 
            }
            return null; // Agar response ajeeb aaye toh null bhejo
            
        } catch (error) {
            console.error("Gemini API Error:", error);
            return null; // Error aane par chup-chaap null return karo, crash mat karo
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(interviewId)
            if (response && response.interviewReport) {
                setReport(response.interviewReport)
                return response.interviewReport
            }
            return null;
        } catch (error) {
            console.error("Fetch Report Error:", error);
            return null;
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            if (response && response.interviewReports) {
                setReports(response.interviewReports)
                return response.interviewReports
            }
            return null;
        } catch (error) {
            console.error("Fetch All Reports Error:", error);
            return null;
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateResumePdf = async ({ interviewReportId }) => {
        // use a special loading state so we can show a downloading spinner
        setLoading("downloading") 
        try {
            const blobData = await generateResumePdfApi({ interviewReportId })
            
            if (blobData) {
                // Create a temporary URL and anchor tag to trigger the browser's download
                const url = window.URL.createObjectURL(new Blob([blobData]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `AI_Enhanced_Resume.pdf`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                return true;
            }
            return false;
        } catch (error) {
            console.error("PDF Download Error:", error);
            return false;
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
      if (interviewId) {
        getReportById(interviewId)
      } else {
        getReports()
      }
    }, [ interviewId ])
    

    return { loading, report, reports, generateReport, getReportById, getReports, handleGenerateResumePdf }
}