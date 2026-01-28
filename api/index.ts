/**
 * Composition root: wire domain, application, infrastructure, presentation.
 * Chạy API server.
 */
import { createApp } from "./presentation/http/app";
import { apiConfig } from "./infrastructure/config";
import { JsonAnalyticsRepository } from "./infrastructure/persistence/jsonAnalyticsRepository";
import { GetDashboardAnalytics } from "./application/use-cases/getDashboardAnalytics";

// Infrastructure
const analyticsRepository = new JsonAnalyticsRepository();

// Application
const getDashboardAnalytics = new GetDashboardAnalytics(analyticsRepository);

// Presentation
const app = createApp(getDashboardAnalytics);

app.listen(apiConfig.port, () => {
  console.log(
    `API running on port ${apiConfig.port}. JSON DB: ${apiConfig.dataFilePath}`
  );
});
