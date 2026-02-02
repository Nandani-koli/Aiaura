// Dashboard page
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getInterviewHistory,
} from "../../api/dashboard.api";


type Interview = {
    _id: string;
    jobDescription: string;
    resumeText: string;
    answers: string[];
    completed: boolean;
    createdAt: string;
    feedback?: {
        score: number;
        strengths: string[];
        improvements: string[];
        finalVerdict: string;
    };
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [totalInterviews, setTotalInterviews] = useState(0);
    const [avgScore, setAvgScore] = useState(0);

    const [interviews, setInterviews] = useState<Interview[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const res = await getInterviewHistory();
            const data = res.data;

            setInterviews(data);
            setTotalInterviews(data.length);

            if (data.length > 0) {
                const avg =
                    data.reduce((sum: number, i: any) => sum + (i?.feedback?.score || 0), 0) /
                    data.length;
                setAvgScore(Number(avg.toFixed(1)));
            }
        };

        loadData();
    }, []);


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {/* CTA */}
            <button
                onClick={() => navigate("/interview")}
                className="mb-6 bg-black text-white px-4 py-2 rounded"
            >
                Start Mock Interview
            </button>

            {/* Stats */}
            <div className="flex gap-4 mb-6">
                <div className="bg-white p-4 shadow rounded w-48">
                    <p className="text-gray-500 text-sm">Total Interviews</p>
                    <p className="text-xl font-bold">{totalInterviews}</p>
                </div>

                <div className="bg-white p-4 shadow rounded w-48">
                    <p className="text-gray-500 text-sm">Avg Score</p>
                    <p className="text-xl font-bold">{avgScore}</p>
                </div>
            </div>


            {/* Recent Interviews */}
            <h2 className="text-lg font-semibold mb-2">Recent Interviews</h2>

            <div className="bg-white shadow rounded">
                {interviews.length === 0 ? (
                    <p className="p-4 text-gray-500">No interviews yet</p>
                ) : (
                    interviews.map((interview) => (
                        <div
                            key={interview._id}
                            className="flex justify-between p-4 border-b"
                        >
                            <div>
                                <p className="font-medium">{interview.jobDescription.substring(0, 50)}...</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(interview.createdAt).toDateString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="font-bold">{interview.feedback?.score || '-'}/10</span>
                                <button
                                    onClick={() =>
                                        navigate(`/interview/result/${interview._id}`)
                                    }
                                    className="text-blue-600"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
