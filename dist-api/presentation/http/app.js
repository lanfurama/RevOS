"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const analytics_routes_1 = require("./analytics.routes");
function createApp(getDashboardAnalytics) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/analytics", (0, analytics_routes_1.createAnalyticsRoutes)(getDashboardAnalytics));
    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });
    app.use((err, _req, res, _next) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    });
    return app;
}
