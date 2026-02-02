// Interview Session page
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitAnswerApi } from "../../api/interview.api";

const InterviewSession = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [question, setQuestion] = useState(
        location.state?.question || ""
    );
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await submitAnswerApi({
                sessionId: sessionId!,
                answer,
            });

            if (res.data.isCompleted || !res.data.nextQuestion) {
                navigate(`/interview/result/${sessionId}`);
            } else {
                setQuestion(res.data.nextQuestion);
                setAnswer("");
            }
        } catch (err) {
            alert("Error submitting answer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Interview Question</h2>

            <div className="p-4 border rounded mb-4 bg-gray-50">
                {question}
            </div>

            <textarea
                placeholder="Your answer"
                className="w-full p-3 border mb-4 h-32"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded"
            >
                {loading ? "Submitting..." : "Submit Answer"}
            </button>
        </div>
    );
};

export default InterviewSession;
