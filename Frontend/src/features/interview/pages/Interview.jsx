import React, { useEffect, useState } from 'react'
import "../style/interview.scss"
import { FaCode, FaComments, FaRobot, FaLightbulb, FaChartBar, FaFileDownload, FaSpinner } from "react-icons/fa"
import { useInterview } from '../hooks/useInterview'
import { useNavigate, useParams } from 'react-router'

const Interview = () => {
    const { interviewId } = useParams()
    const [activeTab, setActiveTab] = useState('technical')

    const { report, loading, getReportById, handleGenerateResumePdf } = useInterview()

    useEffect(() => {
        console.log("1. URL se yeh ID aayi hai:", interviewId);

        const fetchData = async () => {
            if (interviewId) {
                console.log("2. Backend se data fetch karna shuru...");
                const data = await getReportById(interviewId);

                console.log("3. Backend ne yeh data wapas bheja:", data);
            }
        };

        fetchData();
    }, [interviewId]);

    // Don't interpret loading === 'downloading' as a full page reload scenario
    if ((loading === true) || !report) {
        return (
            <div className="interview-loading" style={{ textAlign: "center", padding: "50px", color: "white" }}>
                <h2>Loading your interview analysis...</h2>
                <p>Please wait while we process the data.</p>
            </div>
        );
    }

    // YEH HAI SABSE ZAROORI HISA JO DATA DIKHAYEGA:
    const techQs = report?.technicalQuestions || [];
    const behavQs = report?.behavioralQuestions || report?.behaviouralQuestions || [];
    const skills = report?.skillGaps || report?.skillGap || [];
    const prepPlan = report?.preparationPlan || [];

    return (
        <main className='interview'>
            {/* Header Section */}
            <div className='interview-header'>
                <div className="header-text">
                    <h1>Interview Preparation Report</h1>
                    <p>Customize your preparation path based on the analysis</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="resume-download-btn"
                        onClick={() => handleGenerateResumePdf({ interviewReportId: interviewId })}
                        disabled={loading === 'downloading'}
                    >
                        {loading === 'downloading' ? (
                            <><FaSpinner className="spin-icon" /> Generating PDF...</>
                        ) : (
                            <><FaFileDownload /> Download AI Resume</>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="interview-grid">
                {/* Left Sidebar */}
                <aside className="left-sidebar">
                    {/* Technical Questions */}
                    <div className="sidebar-card">
                        <div className="card-header">
                            <span className="icon"><FaCode /></span>
                            <h3>Technical Questions</h3>
                        </div>
                        <div className="questions-list">
                            {techQs.length > 0 ? (
                                techQs.slice(0, 3).map((q, idx) => (
                                    <div key={idx} className="question-item">
                                        <p>{q.question || q.questions}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-state">No technical questions yet</p>
                            )}
                        </div>
                        <button className="view-all-btn">View All →</button>
                    </div>

                    {/* Behavioral Questions */}
                    <div className="sidebar-card">
                        <div className="card-header">
                            <span className="icon"><FaComments /></span>
                            <h3>Behavioral Questions</h3>
                        </div>
                        <div className="questions-list">
                            {behavQs.length > 0 ? (
                                behavQs.slice(0, 3).map((q, idx) => (
                                    <div key={idx} className="question-item">
                                        <p>{q.question || q.questions}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-state">No behavioral questions yet</p>
                            )}
                        </div>
                        <button className="view-all-btn">View All →</button>
                    </div>

                    {/* Road Map */}
                    <div className="sidebar-card">
                        <div className="card-header">
                            <span className="icon"><FaChartBar /></span>
                            <h3>Road Map</h3>
                        </div>
                        <div className="roadmap-list">
                            {prepPlan.length > 0 ? (
                                prepPlan.slice(0, 3).map((plan, idx) => (
                                    <div key={idx} className="roadmap-item">
                                        <div className="week-badge">Day {plan.day}</div>
                                        <div className="topics">
                                            {(plan.tasks || plan.task || []).slice(0, 2).map((task, i) => (
                                                <span key={i} className="topic-tag">{task}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-state">No preparation plan generated</p>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Center Content */}
                <section className="center-content">
                    <div className="content-card">
                        <div className="content-header">
                            <h2>Interview Analysis</h2>
                            <div className="content-tabs">
                                <button className={`tab ${activeTab === 'technical' ? 'active' : ''}`} onClick={() => setActiveTab('technical')}>Technical Drills</button>
                                <button className={`tab ${activeTab === 'behavioral' ? 'active' : ''}`} onClick={() => setActiveTab('behavioral')}>Behavioral</button>
                                <button className={`tab ${activeTab === 'culture' ? 'active' : ''}`} onClick={() => setActiveTab('culture')}>Culture Fit</button>
                            </div>
                        </div>

                        <div className="content-body">
                            <div className="tab-content">
                                <h3>{activeTab.toUpperCase()} Assessment Data</h3>
                                <p>Analysis loaded from AI model for this section.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Sidebar */}
                <aside className="right-sidebar">
                    {/* Skill Gaps */}
                    <div className="sidebar-card">
                        <div className="card-header">
                            <span className="icon"><FaLightbulb /></span>
                            <h3>Skill Gaps</h3>
                        </div>
                        <div className="skills-list">
                            {skills.length > 0 ? (
                                skills.map((skillObj, idx) => (
                                    <div key={idx} className="skill-item">
                                        <div className="skill-header">
                                            <span className="skill-name">{skillObj.skill}</span>
                                            <span className={`importance-badge ${skillObj.severity}`}>
                                                {skillObj.severity}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-state">No skill gaps identified</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="sidebar-card stats-card">
                        <div className="card-header">
                            <span className="icon"><FaRobot /></span>
                            <h3>Quick Stats</h3>
                        </div>
                        <div className="stats-grid">
                            <div className="stat">
                                <div className="stat-value">{techQs.length}</div>
                                <div className="stat-label">Technical Qs</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{behavQs.length}</div>
                                <div className="stat-label">Behavioral Qs</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{skills.length}</div>
                                <div className="stat-label">Gaps to Fill</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    )
}

export default Interview