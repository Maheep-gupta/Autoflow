'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterChips } from '@/components/ui/filter-chips';
import { ExecutionRowExpandable } from './ExecutionRowExpandable';
import { Activity } from 'lucide-react';

const mockExecutions = [
  {
    id: 'exec-001',
    workflowName: 'Send Daily Summary',
    status: 'success' as const,
    startTime: '2024-03-29 09:00 AM',
    duration: '2.3s',
    triggerType: 'Schedule',
    steps: [
      { name: 'Fetch summary', status: 'success' as const, duration: '0.8s' },
      { name: 'Format email', status: 'success' as const, duration: '0.5s' },
      { name: 'Send to 250 users', status: 'success' as const, duration: '1.0s' },
    ],
  },
  {
    id: 'exec-002',
    workflowName: 'Process Orders',
    status: 'running' as const,
    startTime: '2024-03-29 11:30 AM',
    triggerType: 'Webhook',
    steps: [
      { name: 'Receive order', status: 'success' as const, duration: '0.2s' },
      { name: 'Validate payment', status: 'running' as const, duration: '...' },
      { name: 'Create shipment', status: 'pending' as const, duration: 'Pending' },
    ],
  },
  {
    id: 'exec-003',
    workflowName: 'Database Sync',
    status: 'failed' as const,
    startTime: '2024-03-29 10:15 AM',
    duration: '1.2s',
    triggerType: 'Schedule',
    steps: [
      { name: 'Connect to source', status: 'success' as const, duration: '0.3s' },
      { name: 'Query data', status: 'failed' as const, duration: '0.9s', error: 'Connection timeout' },
      { name: 'Sync to destination', status: 'pending' as const, duration: 'Skipped' },
    ],
  },
];

interface ExecutionsGridProps {
  loading?: boolean;
}

export function ExecutionsGrid({ loading = false }: ExecutionsGridProps) {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const filterChips = [
    { id: 'success', value: 'success', label: 'Success', count: 124 },
    { id: 'failed', value: 'failed', label: 'Failed', count: 8 },
    { id: 'running', value: 'running', label: 'Running', count: 3 },
  ];

  const filteredExecutions = statusFilter.length > 0
    ? mockExecutions.filter(exec => statusFilter.includes(exec.status))
    : mockExecutions;

  if (loading) {
    return <LoadingSkeleton count={5} />;
  }

  if (filteredExecutions.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No executions found"
        description="No workflows have been executed yet"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Execution History</h2>
        <FilterChips
          chips={filterChips}
          selected={statusFilter}
          onChange={setStatusFilter}
          multiple={true}
        />
      </div>

      <div className="space-y-3">
        {filteredExecutions.map(exec => (
          <ExecutionRowExpandable key={exec.id} {...exec} />
        ))}
      </div>
    </div>
  );
}
