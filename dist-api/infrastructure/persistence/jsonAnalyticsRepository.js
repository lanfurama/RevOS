"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonAnalyticsRepository = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
async function ensureDirectoryExists(filePath) {
    const dir = path_1.default.dirname(filePath);
    await fs_1.promises.mkdir(dir, { recursive: true });
}
/**
 * Adapter: lưu/đọc analytics từ file JSON.
 * Implement port IAnalyticsRepository.
 */
class JsonAnalyticsRepository {
    get filePath() {
        return config_1.apiConfig.dataFilePath;
    }
    async getAnalyticsDb() {
        try {
            const raw = await fs_1.promises.readFile(this.filePath, "utf-8");
            return JSON.parse(raw);
        }
        catch (err) {
            if (err.code === "ENOENT") {
                throw new Error(`JSON database file not found at ${this.filePath}. Initialise it first.`);
            }
            throw err;
        }
    }
    async saveAnalyticsDb(db) {
        await ensureDirectoryExists(this.filePath);
        const content = JSON.stringify(db, null, 2);
        await fs_1.promises.writeFile(this.filePath, content, { encoding: "utf-8" });
    }
}
exports.JsonAnalyticsRepository = JsonAnalyticsRepository;
