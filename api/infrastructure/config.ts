import path from "path";

const ROOT_DIR = path.resolve(__dirname, "..", "..");

export const apiConfig = {
  port: Number(process.env.PORT) || 4000,
  dataFilePath:
    process.env.DATA_FILE_PATH ||
    path.join(ROOT_DIR, "data", "analytics-db.json"),
};

export type ApiConfig = typeof apiConfig;
