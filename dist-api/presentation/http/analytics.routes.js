"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyticsRoutes = createAnalyticsRoutes;
const express_1 = require("express");
/**
 * HTTP adapter: map request/response sang use case.
 */
function createAnalyticsRoutes(getDashboardAnalytics) {
    const router = (0, express_1.Router)();
    router.get("/dashboard", async (_req, res, next) => {
        try {
            const data = await getDashboardAnalytics.execute();
            res.json(data);
        }
        catch (err) {
            next(err);
        }
    });
    return router;
}
