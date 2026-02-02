// Start Interview page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterviewApi } from "../../api/interview.api";

const StartInterview = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startInterviewApi({ jobDescription, resumeText });
      navigate(`/interview/${res.data.sessionId}`, {
        state: { question: res.data.firstQuestion },
      });
    } catch (err) {
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Start Mock Interview</h1>

      <textarea
        placeholder="Paste Job Description"
        className="w-full p-3 border mb-4 h-32"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <textarea
        placeholder="Paste Resume Text"
        className="w-full p-3 border mb-4 h-32"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <button
        onClick={handleStart}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Starting..." : "Start Interview"}
      </button>

      <button
        onClick={() => navigate("/dashboard")}
        className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default StartInterview;
