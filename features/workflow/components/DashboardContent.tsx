'use client';

import React, { useState } from 'react';
import { EnhancedStatCard } from '@/components/enhanced-stat-card';
import { EnhancedWorkflowCard } from '@/components/enhanced-workflow-card';
import { Activity, Zap, CheckCircle2, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardStatsProps {
  loading?: boolean;
}

export function DashboardStats({ loading = false }: DashboardStatsProps) {
  const mockStats = [
    {
      icon: Zap,
      label: 'Total Workflows',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      sparklineData: [2, 4, 3, 5, 4, 6, 5, 7],
    },
    {
      icon: Activity,
      label: 'Active Now',
      value: '8',
      change: '+5%',
      changeType: 'positive' as const,
      sparklineData: [1, 3, 2, 4, 5, 4, 6, 7],
    },
    {
      icon: CheckCircle2,
      label: 'Success Rate',
      value: '98.5%',
      change: '+2.3%',
      changeType: 'positive' as const,
      sparklineData: [85, 87, 89, 88, 90, 91, 93, 95],
    },
    {
      icon: TrendingUp,
      label: 'Executions',
      value: '1.2k',
      change: '+8%',
      changeType: 'positive' as const,
      sparklineData: [100, 120, 110, 140, 130, 150, 140, 160],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {mockStats.map((stat, i) => (
        <EnhancedStatCard
          key={i}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          sparklineData={stat.sparklineData}
        />
      ))}
    </div>
  );
}

interface WorkflowsGridProps {
  loading?: boolean;
}

export function WorkflowsGrid({ loading = false }: WorkflowsGridProps) {
  const mockWorkflows = [
    {
      id: '1',
      name: 'Send Daily Summary',
      description: 'Email workflow summary every morning',
      status: 'active' as const,
      lastRun: { status: 'success' as const, timestamp: '10 mins ago' },
      steps: [
        { id: '1', type: 'Trigger', name: 'Schedule' },
        { id: '2', type: 'Action', name: 'Fetch data' },
        { id: '3', type: 'Action', name: 'Send email' },
      ],
      triggerCount: 180,
    },
    {
      id: '2',
      name: 'Slack Notifications',
      description: 'Alert team on workflow failures',
      status: 'active' as const,
      lastRun: { status: 'success' as const, timestamp: '30 mins ago' },
      steps: [
        { id: '1', type: 'Trigger', name: 'Error event' },
        { id: '2', type: 'Action', name: 'Format message' },
        { id: '3', type: 'Action', name: 'Post to Slack' },
      ],
      triggerCount: 45,
    },
    {
      id: '3',
      name: 'Database Sync',
      description: 'Synchronize data across databases',
      status: 'paused' as const,
      lastRun: { status: 'success' as const, timestamp: '1 day ago' },
      steps: [
        { id: '1', type: 'Trigger', name: 'Hourly' },
        { id: '2', type: 'Action', name: 'Query source' },
        { id: '3', type: 'Action', name: 'Update destination' },
      ],
      triggerCount: 72,
    },
  ];

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading workflows...</div>;
  }

  if (mockWorkflows.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Zap className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p className="text-lg font-semibold mb-2">No workflows yet</p>
        <p className="text-sm">Create your first workflow to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Workflows</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockWorkflows.map(workflow => (
          <EnhancedWorkflowCard
            key={workflow.id}
            workflow={workflow as any}
          />
        ))}
      </div>
    </div>
  );
}
