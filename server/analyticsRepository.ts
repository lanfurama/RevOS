import { readJsonFile, writeJsonFile } from "./infra-jsonDatabase";
import { AnalyticsDatabase } from "./domain";

// Repository layer: làm việc trực tiếp với "database" JSON

export async function getAnalyticsDb(): Promise<AnalyticsDatabase> {
  return await readJsonFile<AnalyticsDatabase>();
}

export async function saveAnalyticsDb(db: AnalyticsDatabase): Promise<void> {
  await writeJsonFile<AnalyticsDatabase>(db);
}

