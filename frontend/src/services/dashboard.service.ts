/**
 * @file dashboard.service.ts
 * @description API service for Dashboard aggregations and KPIs.
 */

import { api } from '../lib/api';

export interface SchoolAdminKpi {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance?: {
    rate: number;
    // Per-head counts are not returned by GET /dashboard yet (only the rate)
    present?: number;
    absent?: number;
    total?: number;
  };
  fees: {
    totalBilled: number;
    totalCollected: number;
    totalPending: number;
    collectionRate: number;
  };
}

export interface SchoolAdminDashboardData {
  kpi: SchoolAdminKpi;
  recentAnnouncements: any[];
  upcomingExams: any[];
}

export const dashboardService = {
  /** Get School Admin Dashboard aggregations */
  getSchoolAdminDashboard: async (): Promise<SchoolAdminDashboardData> => {
    const res = await api.get('/dashboard');
    const d = res.data?.data ?? {};
    if (d.kpi) return d;
    // GET /dashboard returns { stats, fees, ... } — normalise to the { kpi } shape the view reads
    const stats = d.stats ?? {};
    const fees = d.fees ?? {};
    return {
      kpi: {
        totalStudents: stats.totalStudents ?? 0,
        totalTeachers: stats.totalTeachers ?? 0,
        totalClasses: stats.totalClasses ?? 0,
        todayAttendance:
          typeof stats.todayAttendancePercentage === 'number' ? { rate: stats.todayAttendancePercentage } : undefined,
        fees: {
          totalBilled: fees.totalBilled ?? 0,
          totalCollected: fees.totalCollected ?? 0,
          totalPending: fees.totalPending ?? 0,
          collectionRate: fees.collectionPercentage ?? fees.collectionRate ?? 0,
        },
      },
      recentAnnouncements: d.recentAnnouncements ?? [],
      upcomingExams: d.upcomingExams ?? [],
    };
  },

  /** Get Super Admin Platform Dashboard */
  getSuperAdminDashboard: async (): Promise<any> => {
    const res = await api.get('/admin/dashboard');
    return res.data?.data;
  },
};
