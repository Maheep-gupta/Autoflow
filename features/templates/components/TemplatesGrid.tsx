'use client';

import React from 'react';
import { TemplateCard } from '@/features/templates/components/TemplateCard';
import { Button } from '@/components/ui/button';
import { FilterChips } from '@/components/ui/filter-chips';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Zap, MessageSquare, ShoppingCart, BarChart3 } from 'lucide-react';
import { useState } from 'react';

const mockTemplates = [
  {
    id: 'template-1',
    title: 'Daily Email Digest',
    description: 'Send a summary of daily activities to your inbox',
    category: 'Email',
    isPopular: true,
    icon: <Zap className="h-5 w-5" />,
    steps: [
      { name: 'Trigger', type: 'Every morning at 9 AM' },
      { name: 'Action', type: 'Fetch daily summary' },
      { name: 'Action', type: 'Send email' },
    ],
  },
  {
    id: 'template-2',
    title: 'Slack Notifications',
    description: 'Get instant Slack alerts for important events',
    category: 'Communication',
    isPopular: true,
    icon: <MessageSquare className="h-5 w-5" />,
    steps: [
      { name: 'Trigger', type: 'Event occurs' },
      { name: 'Action', type: 'Format message' },
      { name: 'Action', type: 'Post to Slack' },
    ],
  },
  {
    id: 'template-3',
    title: 'E-commerce Order Processing',
    description: 'Automate your entire order fulfillment workflow',
    category: 'Sales',
    icon: <ShoppingCart className="h-5 w-5" />,
    steps: [
      { name: 'Trigger', type: 'New order received' },
      { name: 'Action', type: 'Validate payment' },
      { name: 'Action', type: 'Create shipment' },
      { name: 'Action', type: 'Send confirmation' },
    ],
  },
  {
    id: 'template-4',
    title: 'Analytics Dashboard Sync',
    description: 'Keep your analytics dashboard updated in real-time',
    category: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    steps: [
      { name: 'Trigger', type: 'Hourly' },
      { name: 'Action', type: 'Fetch data' },
      { name: 'Action', type: 'Transform data' },
      { name: 'Action', type: 'Update dashboard' },
    ],
  },
  {
    id: 'template-5',
    title: 'Customer Feedback Loop',
    description: 'Automatically collect and organize customer feedback',
    category: 'Communication',
    steps: [
      { name: 'Trigger', type: 'New feedback' },
      { name: 'Action', type: 'Parse content' },
      { name: 'Action', type: 'Save to database' },
      { name: 'Action', type: 'Notify team' },
    ],
  },
  {
    id: 'template-6',
    title: 'Lead Scoring Pipeline',
    description: 'Score and prioritize leads automatically',
    category: 'Sales',
    isPopular: true,
    icon: <Zap className="h-5 w-5" />,
    steps: [
      { name: 'Trigger', type: 'New lead' },
      { name: 'Action', type: 'Gather info' },
      { name: 'Action', type: 'Score lead' },
      { name: 'Action', type: 'Route to sales' },
    ],
  },
];

interface TemplatesGridProps {
  loading?: boolean;
}

export function TemplatesGrid({ loading = false }: TemplatesGridProps) {
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

const categories = [
  { label: 'Email', value: 'Email', count: 3 },
  { label: 'Communication', value: 'Communication', count: 2 },
  { label: 'Sales', value: 'Sales', count: 2 },
  { label: 'Analytics', value: 'Analytics', count: 1 },
];

  const filteredTemplates = categoryFilter.length > 0
    ? mockTemplates.filter(t => categoryFilter.includes(t.category))
    : mockTemplates;

  if (loading) {
    return <LoadingSkeleton count={6} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Template Gallery</h2>
        <p className="text-muted-foreground mb-4">Start with a pre-built template</p>
        <FilterChips
          chips={categories}
          selected={categoryFilter}
          onChange={setCategoryFilter}
          multiple={true}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id} {...template} />
        ))}
      </div>
    </div>
  );
}
