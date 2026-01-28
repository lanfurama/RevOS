import path from "path";

const ROOT_DIR = path.resolve(__dirname, "..");

export const serverConfig = {
  port: Number(process.env.PORT) || 4000,

  // Path tới file JSON "database".
  // Có thể override bằng biến môi trường DATA_FILE_PATH để giấu file ở nơi khác.
  dataFilePath:
    process.env.DATA_FILE_PATH ||
    path.join(ROOT_DIR, "data", "analytics-db.json"),
};

export type ServerConfig = typeof serverConfig;

