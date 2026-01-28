"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Composition root: wire domain, application, infrastructure, presentation.
 * Chạy API server.
 */
const app_1 = require("./presentation/http/app");
const config_1 = require("./infrastructure/config");
const jsonAnalyticsRepository_1 = require("./infrastructure/persistence/jsonAnalyticsRepository");
const getDashboardAnalytics_1 = require("./application/use-cases/getDashboardAnalytics");
// Infrastructure
const analyticsRepository = new jsonAnalyticsRepository_1.JsonAnalyticsRepository();
// Application
const getDashboardAnalytics = new getDashboardAnalytics_1.GetDashboardAnalytics(analyticsRepository);
// Presentation
const app = (0, app_1.createApp)(getDashboardAnalytics);
app.listen(config_1.apiConfig.port, () => {
    console.log(`API running on port ${config_1.apiConfig.port}. JSON DB: ${config_1.apiConfig.dataFilePath}`);
});
