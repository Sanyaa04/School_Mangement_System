/**
 * @file useTimetable.ts
 * @description TanStack Query hooks for weekly class / teacher timetables.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { timetableService } from '../services';
import type { CreateTimetableEntryDto, TimetableFilters } from '../services';

export const TIMETABLE_KEYS = {
  all: ['timetable'] as const,
  list: (filters: TimetableFilters) => [...TIMETABLE_KEYS.all, 'list', filters] as const,
  parentScope: () => [...TIMETABLE_KEYS.all, 'parent-scope'] as const,
};

/**
 * Weekly timetable for a section or teacher. Disabled until a filter is known so
 * we never fetch the whole school's schedule by accident.
 */
export const useTimetable = (filters: TimetableFilters, enabled = true) => {
  const hasFilter = Boolean(filters.sectionId || filters.teacherId);
  return useQuery({
    queryKey: TIMETABLE_KEYS.list(filters),
    queryFn: () => timetableService.getTimetable(filters),
    enabled: enabled && hasFilter,
    staleTime: 1000 * 60 * 5,
  });
};

export interface ClassScope {
  classId: string;
  sectionId: string;
  className?: string;
  sectionName?: string;
  rollNumber?: string | null;
  studentName?: string;
}

/**
 * For parents: resolve the first child's active class/section via the parent dashboard API.
 */
export const useParentClassScope = (enabled: boolean) => {
  return useQuery({
    queryKey: TIMETABLE_KEYS.parentScope(),
    enabled,
    staleTime: 1000 * 60 * 10,
    queryFn: async (): Promise<ClassScope | null> => {
      const childrenRes = await api.get<{ data: Array<{ id: string; firstName: string; lastName?: string | null }> }>(
        '/parent/children'
      );
      const child = childrenRes.data.data?.[0];
      if (!child) return null;

      const dashRes = await api.get<{
        data: {
          enrollment?: {
            classId: string;
            sectionId: string;
            rollNumber?: string | null;
            class?: { name: string };
            section?: { name: string };
          } | null;
        };
      }>('/parent/dashboard', { params: { studentId: child.id } });

      const enrollment = dashRes.data.data?.enrollment;
      if (!enrollment) return null;
      return {
        classId: enrollment.classId,
        sectionId: enrollment.sectionId,
        className: enrollment.class?.name,
        sectionName: enrollment.section?.name,
        rollNumber: enrollment.rollNumber,
        studentName: [child.firstName, child.lastName].filter(Boolean).join(' '),
      };
    },
  });
};

export const useCreateTimetableEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimetableEntryDto) => timetableService.createEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIMETABLE_KEYS.all });
    },
  });
};
