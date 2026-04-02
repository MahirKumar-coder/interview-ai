import React, { useRef, useState } from 'react'
import "../style/home.scss"
import { MdDescription } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdAutoAwesome } from "react-icons/md";
import { useInterview } from '../hooks/useInterview';
import { Link, useNavigate } from 'react-router';

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        // Validation: Check karo file hai ya nahi
        const files = resumeInputRef.current?.files;
        if (!files || files.length === 0) {
            alert("Bhai, pehle resume upload kar de!"); // Ya toast notification laga dena
            return;
        }

        if (!jobDescription.trim()) {
            alert("Job description bhi zaroori hai!");
            return;
        }

        try {
            const resumeFile = files[0];
            const data = await generateReport({ jobDescription, selfDescription, resumeFile });

            // Check karo ki backend se sahi data (aur _id) aaya hai ya nahi
            if (data && data._id) {
                console.log("Mera data:", data);
                navigate(`/interview/${data._id}`);
            } else {
                alert("Report generate nahi hui, network tab check kar.");
            }
        } catch (error) {
            console.error("Report generate karne me error:", error);
        }
    }

    return (
        <main className='home'>
            {/* Header Section */}
            <div className='header-section'>
                <h1>Interview Intelligence</h1>
                <p>Synthesize deep insights from job descriptions and candidate profiles using our high-fidelity cognitive engine.</p>
            </div>

            {/* Main Content */}
            <div className="interview-container">
                {/* Left Column - Job Description */}
                <div className="left-column">
                    <div className="input-card">
                        <div className="card-header">
                            <span className="icon"><MdDescription /></span>
                            <h3>Job Description</h3>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            name="jobDescription"
                            id="jobDescription"
                            placeholder='Paste the detailed job description, required technical stacks, and cultural requirements here...'
                            className='job-description-textarea'
                        ></textarea>
                        <div className="card-footer">
                            <span>Markdown supported</span>
                            <span>Min. 200 words recommended</span>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    {/* Upload Resume Card */}
                    <div className="input-card">
                        <div className="card-header">
                            <span className="icon"><FaFileUpload /></span>
                            <h3>Upload Resume</h3>
                        </div>
                        <div className="upload-area">
                            <div className="upload-icon">☁️</div>
                            <p>Drag and drop PDF or DOCX</p>
                            <p className="file-size">Max size 10MB</p>
                            <label htmlFor="resume" className='upload-button'>Choose File</label>
                            <input ref={resumeInputRef} hidden type="file" name='resume' id='resume' accept='.pdf,.docx,.doc' />
                        </div>
                    </div>

                    {/* Candidate Profile Notes Card */}
                    <div className="input-card">
                        <div className="card-header">
                            <span className="icon"><ImProfile /></span>
                            <h3>Candidate Profile Notes</h3>
                        </div>
                        <textarea
                            onChange={(e) => { setSelfDescription(e.target.value) }}
                            name="candidateNotes"
                            id="candidateNotes"
                            placeholder="Add specific notes about the candidate's background, or focal points for the AI..."
                            className='notes-textarea'
                        ></textarea>
                    </div>

                    {/* Ready to Analyze Section */}
                    <div className="analyze-section">
                        <div className="analyze-info">
                            <div className="analyze-icon"><MdAutoAwesome /></div>
                            <div className="analyze-text">
                                <h4>Ready to Analyze?</h4>
                                <p>Our AI will generate behavioral questions, technical drills, and culture-fit assessments.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleGenerateReport}
                            className='generate-button'
                            disabled={loading} // Loading ke time button disable ho jayega
                        >
                            {loading ? "Generating Report..." : "Generate Interview Report"}
                            {!loading && <span className="arrow">→</span>}
                        </button>
                    </div>

                    {reports.length > 0 && (
                        <div className="reports-section">
                            <h3>Previous Reports</h3>
                            <ul>
                                {reports.map((report) => (
                                    <section key={report._id} className='recent-reports'>
                                        <li 
                                            className='report-items'
                                            onClick={() => navigate(`/interview/${report._id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span className='job-title'>{report.jobTitle || 'Interview Report'}</span>
                                            <p className='report-meta'>{report?.createdAt?.slice(0, 10)}</p>
                                            <p className='report-meta'>{report?.resume?.name || 'Resume'}</p>
                                        </li>
                                    </section>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Home

// 5:13:31