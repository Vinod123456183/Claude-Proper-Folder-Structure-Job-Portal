import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import indexRouter from "./routes/index-router";
import userRouter from "./routes/user-router";
import companyRouter from "./routes/company-router";
import { connectDB } from "./utils/db-connection";
import cookieParser from "cookie-parser";
import jobRouter from "./routes/job-router";
import applicationRouter from "./routes/application-router";
dotenv.config();

const app: Application = express();

const allowedOrigins = [
  "http://localhost:5173",
  // "http://127.0.0.1:3000", // optional for localhost via IP
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Middlewares
app.use(cookieParser()); // ← must come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err: any, req: any, res: any, next: any) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ message: "Invalid JSON body", success: false });
  }
  next(err);
});

  // Routes
  app.use("/", indexRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);
  app.use("/application", applicationRouter);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, async () => {
    await connectDB();
    console.log(`App Running on port ${PORT}`);
  });






// -----------

// import express, { Application, Request, Response } from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import indexRouter from "./routes/index-router";
// import userRouter from "./routes/user-router";
// import companyRouter from "./routes/company-router";
// import { connectDB } from "./utils/db-connection";
// dotenv.config();

// const app: Application = express();

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// app.use("/", indexRouter);
// app.use("/user", userRouter);
// app.use("/company", companyRouter);
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   connectDB();
//   console.log("App Running");
// });
