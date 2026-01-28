"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = void 0;
const path_1 = __importDefault(require("path"));
const ROOT_DIR = path_1.default.resolve(__dirname, "..", "..");
exports.apiConfig = {
    port: Number(process.env.PORT) || 4000,
    dataFilePath: process.env.DATA_FILE_PATH ||
        path_1.default.join(ROOT_DIR, "data", "analytics-db.json"),
};
