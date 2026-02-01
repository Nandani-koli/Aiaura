import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import interviewRoutes from "./routes/interview.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { connectDB } from './services/db';

console.log("AIaura backend starting...");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('AIaura backend is running!');
});

app.use("/interview", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});