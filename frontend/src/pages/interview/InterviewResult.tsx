import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedbackApi } from "../../api/interview.api";

type InterviewSession = {
  _id: string;
  jobDescription: string;
  resumeText: string;
  answers: string[];
  completed: boolean;
  feedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    finalVerdict: string;
  };
  createdAt: string;
};

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getFeedbackApi(id!);
        setSession(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load interview details");
        console.error("Error loading interview:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <p className="p-6">Loading interview details...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!session) return <p className="p-6">Interview not found</p>;

  const feedback = session.feedback;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Interview Summary</h1>

      {/* Date */}
      <p className="text-gray-600 mb-6">
        <strong>Completed:</strong> {new Date(session.createdAt).toLocaleString()}
      </p>

      {/* Job Description */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{session.jobDescription}</p>
      </div>

      {/* Resume */}
      <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
        <h2 className="text-xl font-semibold mb-2">Your Resume</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{session.resumeText}</p>
      </div>

      {/* Questions & Answers */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Interview Q&A</h2>
        {session.answers.length === 0 ? (
          <p className="text-gray-500">No answers recorded</p>
        ) : (
          <div className="space-y-4">
            {session.answers.map((answer, index) => (
              <div key={index} className="p-4 border rounded bg-gray-50">
                <div className="mb-2">
                  <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm mr-2">
                    Q {index + 1}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-gray-700"><strong>Your Answer:</strong></p>
                  <p className="text-gray-600 mt-1 whitespace-pre-wrap">{answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <h2 className="text-xl font-semibold mb-4">Feedback & Score</h2>

          <div className="mb-4">
            <p className="text-3xl font-bold text-center">
              <span className="text-yellow-600">{feedback.score}</span>/10
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
            <ul className="list-disc ml-6 text-gray-700">
              {feedback.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-orange-700 mb-2">Areas for Improvement</h3>
            <ul className="list-disc ml-6 text-gray-700">
              {feedback.improvements.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-blue-100 rounded">
            <p><strong>Final Verdict:</strong> {feedback.finalVerdict}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default InterviewResult;
