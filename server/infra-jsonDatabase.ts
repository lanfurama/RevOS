import { promises as fs } from "fs";
import path from "path";
import { serverConfig } from "./config";

// Generic JSON file "database" helper

async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

export async function readJsonFile<T>(): Promise<T> {
  const filePath = serverConfig.dataFilePath;

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error(
        `JSON database file not found at ${filePath}. Initialise it first.`
      );
    }
    throw err;
  }
}

export async function writeJsonFile<T>(data: T): Promise<void> {
  const filePath = serverConfig.dataFilePath;
  await ensureDirectoryExists(filePath);
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, { encoding: "utf-8" });
}

