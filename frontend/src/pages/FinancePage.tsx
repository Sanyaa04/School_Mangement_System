/**
 * @file FinancePage.tsx
 * @description Role-Aware School Finance & Fee Portal.
 * - Students & Parents strictly see their personal fee ledger, installment schedule,
 *   downloadable payment receipts, itemized CBSE fee structure, and online UPI payment portal.
 * - Administrators & Accountants see school-wide revenue metrics, collection rates,
 *   bulk invoice tools, and the master student ledger.
 */


import React from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  SchoolAdminFinanceView,
  StudentPersonalFeesView,
  ParentFeeLedgerView,
} from '../components/features/finance';

export const FinancePage: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'PARENT') {
    return <ParentFeeLedgerView user={user} />;
  }

  if (user?.role === 'STUDENT') {
    return <StudentPersonalFeesView user={user} />;
  }

  // Fee data is restricted to school admins on the backend; don't render an empty admin console
  if (user?.role === 'TEACHER') {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-surface rounded-3xl p-10 border border-border shadow-card text-center">
        <Lock className="w-10 h-10 mx-auto mb-3 text-muted" />
        <h1 className="text-lg font-bold text-primary">Finance is managed by the school office</h1>
        <p className="text-sm text-secondary mt-1">
          Fee structures, invoices and payments are only available to school administrators.
        </p>
      </div>
    );
  }

  return <SchoolAdminFinanceView user={user} />;
};
