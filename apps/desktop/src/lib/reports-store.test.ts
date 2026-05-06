// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readReports, writeReports, saveReport, deleteReport, getReports } from './reports-store';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('reports-store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should save and retrieve reports', () => {
    const report = { id: 'test-id', title: 'Test' } as any;
    saveReport(report);
    
    const reports = getReports();
    expect(reports).toHaveLength(1);
    expect(reports[0].id).toBe('test-id');
  });

  it('should delete a report by id', () => {
    const report1 = { id: 'id-1', title: 'One' } as any;
    const report2 = { id: 'id-2', title: 'Two' } as any;
    
    saveReport(report1);
    saveReport(report2);
    
    expect(getReports()).toHaveLength(2);
    
    deleteReport('id-1');
    
    const reports = getReports();
    expect(reports).toHaveLength(1);
    expect(reports[0].id).toBe('id-2');
  });

  it('should not delete anything if id does not match', () => {
    const report = { id: 'id-1', title: 'One' } as any;
    saveReport(report);
    
    deleteReport('wrong-id');
    
    expect(getReports()).toHaveLength(1);
  });
});
