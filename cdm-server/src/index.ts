import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { isAuthMock } from "./middlewares/isAuthMock";
import AuthRoute from "./routes/AuthRoute";

console.log(process.env);

const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "";

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [CORS_ORIGIN, CORS_ORIGIN.split("://").join("://www.")]
        : CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data

app.use("/api/auth", AuthRoute);

app.get("/api/protected/test", isAuthMock, (_, res) => {
  res.send({
    success: true,
    data: "Here is some protected information from the server",
  });
});

app.use(errorHandler);

// Handle production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(__dirname + "/client/"));

  // Handle SPA
  app.get(/.*/, (_, res) => res.sendFile(__dirname + "/client/index.html"));
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
