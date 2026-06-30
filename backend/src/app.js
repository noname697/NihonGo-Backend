const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const corsOptions = require("./config/cors");

const authRouter = require("./routes/auth.routes");
const contentRouter = require("./routes/content.routes");
const progressRouter = require("./routes/progress.routes");
const trainerRouter = require("./routes/trainer.routes");
const flashcardRouter = require("./routes/flashcard.routes");
const dashboardRouter = require("./routes/dashboard.routes");

const { apiLimiter } = require("./middlewares/rateLimit.middleware");
const notFoundMiddleware = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(apiLimiter);

app.get("/", (req, res) => {
  return res.json({
    message: "NihonGo! API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api/progress", progressRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/flashcards", flashcardRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
