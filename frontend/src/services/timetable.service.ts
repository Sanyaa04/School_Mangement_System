/**
 * @file timetable.service.ts
 * @description Frontend API service for Weekly Timetables, Room Schedules, and Period Slot Management.
 */

import { api } from '../lib/api';

/** Mirrors the Prisma `DayOfWeek` enum — the API sends these strings, not numbers. */
export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export const SCHOOL_DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export interface TimetableEntry {
  id: string;
  schoolId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId?: string | null;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string; // "09:00"
  endTime: string; // "09:45"
  roomNumber?: string | null;
  subject?: { id?: string; name: string; code: string };
  teacher?: { id: string; designation?: string | null; user: { id?: string; name: string } } | null;
  class?: { id?: string; name: string };
  section?: { id?: string; name: string };
}

/** `GET /timetable` returns entries grouped by day (MONDAY…SATURDAY), each sorted by period. */
export type WeeklyTimetable = Partial<Record<DayOfWeek, TimetableEntry[]>>;

export interface CreateTimetableEntryDto {
  academicYearId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId?: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  roomNumber?: string;
}

export interface TimetableFilters {
  classId?: string;
  sectionId?: string;
  teacherId?: string;
  academicYearId?: string;
}

export const timetableService = {
  /**
   * Fetch the weekly timetable (grouped by day) matching filters
   */
  async getTimetable(filters?: TimetableFilters): Promise<WeeklyTimetable> {
    const response = await api.get<{ data: WeeklyTimetable }>('/timetable', { params: filters });
    return response.data.data ?? {};
  },

  /**
   * Create a new period slot in the timetable
   */
  async createEntry(data: CreateTimetableEntryDto): Promise<TimetableEntry> {
    const response = await api.post<{ data: TimetableEntry }>('/timetable', data);
    return response.data.data;
  },

  /**
   * Delete a period slot
   */
  async deleteEntry(id: string): Promise<void> {
    await api.delete(`/timetable/${id}`);
  },
};
