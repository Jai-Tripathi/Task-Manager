import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/ConnectDB.js";
import boardRoutes from "./routes/board-route.js";


dotenv.config();

const PORT = process.env.PORT;
const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}
));

app.use("/api", boardRoutes);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*path", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});