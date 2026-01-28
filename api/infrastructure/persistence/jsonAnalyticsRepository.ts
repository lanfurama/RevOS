import { promises as fs } from "fs";
import path from "path";
import type { IAnalyticsRepository } from "../../domain/ports/analyticsRepository.port";
import type { AnalyticsDatabase } from "../../domain/entities";
import { apiConfig } from "../config";

async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Adapter: lưu/đọc analytics từ file JSON.
 * Implement port IAnalyticsRepository.
 */
export class JsonAnalyticsRepository implements IAnalyticsRepository {
  private get filePath(): string {
    return apiConfig.dataFilePath;
  }

  async getAnalyticsDb(): Promise<AnalyticsDatabase> {
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(raw) as AnalyticsDatabase;
    } catch (err: any) {
      if (err.code === "ENOENT") {
        throw new Error(
          `JSON database file not found at ${this.filePath}. Initialise it first.`
        );
      }
      throw err;
    }
  }

  async saveAnalyticsDb(db: AnalyticsDatabase): Promise<void> {
    await ensureDirectoryExists(this.filePath);
    const content = JSON.stringify(db, null, 2);
    await fs.writeFile(this.filePath, content, { encoding: "utf-8" });
  }
}
