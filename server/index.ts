import express from "express";
import { analyticsRouter } from "./routes-analytics";
import { serverConfig } from "./config";

const app = express();

app.use(express.json());

app.use("/api/analytics", analyticsRouter);

// Simple health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Global error handler
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

app.listen(serverConfig.port, () => {
  console.log(
    `Server running on port ${serverConfig.port}. JSON DB: ${serverConfig.dataFilePath}`
  );
});

