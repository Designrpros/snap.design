import type { DesignEntry } from "@snap/shared";

const STORAGE_KEY = "snap-design-reports";

export function readReports(): DesignEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeReports(reports: DesignEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function getReports(): DesignEntry[] {
  return readReports();
}

export function getReportById(id: string): DesignEntry | undefined {
  return readReports().find((r) => r.id === id);
}

export function saveReport(report: DesignEntry): void {
  const reports = readReports();
  const existing = reports.findIndex((r) => r.id === report.id);
  if (existing >= 0) {
    reports[existing] = report;
  } else {
    reports.unshift(report);
  }
  writeReports(reports);
}

export function deleteReport(id: string): void {
  writeReports(readReports().filter((r) => r.id !== id));
}
