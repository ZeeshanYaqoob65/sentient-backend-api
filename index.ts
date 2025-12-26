import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import * as dotenv from "dotenv";
import expressStatusMonitor from "express-status-monitor";
import { AppDataSource } from "./src/config/database";

// Import routes
import authRoutes from "./src/routes/auth.routes";
import baRoutes from "./src/routes/ba.routes";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(compression() as any); // Compress responses

// Express Status Monitor Dashboard
// Access at: http://localhost:3000/status
app.use(
  expressStatusMonitor({
    title: "Sentient API Monitor",
    path: "/status",
    spans: [
      { interval: 1, retention: 60 }, // 1 minute spans, keep 60
      { interval: 5, retention: 60 }, // 5 minute spans, keep 60
      { interval: 15, retention: 60 }, // 15 minute spans, keep 60
    ],
    chartVisibility: {
      cpu: true,
      mem: true,
      load: true,
      heap: true,
      responseTime: true,
      rps: true,
      statusCodes: true,
    },
    healthChecks: [
      {
        protocol: "http",
        host: "localhost",
        path: "/health",
        port: parseInt(String(PORT)),
      },
    ],
  })
);

// Enhanced logging with response time
morgan.token("response-time-ms", (req: any, res: any) => {
  return `${res["response-time"]}ms`;
});
app.use(
  morgan(
    ":method :url :status :response-time-ms - :res[content-length] bytes"
  ) as any
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(process.env.UPLOAD_PATH || "./uploads"));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ba", baRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await AppDataSource.destroy();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  await AppDataSource.destroy();
  process.exit(0);
});

export default app;
