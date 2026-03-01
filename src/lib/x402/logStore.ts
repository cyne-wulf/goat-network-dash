import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { LogEntry, LogEntrySchema } from "@/lib/x402/types";

const dataDir = path.join(process.cwd(), "data");
const logFilePath = path.join(dataDir, "logs.json");

async function ensureLogFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(logFilePath, "utf-8");
  } catch {
    await writeFile(logFilePath, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function readLogs(): Promise<LogEntry[]> {
  await ensureLogFile();
  const raw = await readFile(logFilePath, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed
          .map((entry) => LogEntrySchema.safeParse(entry))
          .filter((result) => result.success)
          .map((result) => result.data)
      : [];
  } catch {
    return [];
  }
}

export async function appendLog(entry: LogEntry) {
  await ensureLogFile();
  const logs = await readLogs();
  logs.push(entry);
  await writeFile(logFilePath, JSON.stringify(logs, null, 2), "utf-8");
}
