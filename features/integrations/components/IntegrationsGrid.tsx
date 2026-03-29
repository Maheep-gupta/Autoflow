'use client';

import React, { useState } from 'react';
import { IntegrationCard } from '@/features/integrations/components/IntegrationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Search, Slack, Mail, LogIn, Figma, Square } from 'lucide-react';

const mockIntegrations = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications and messages to your Slack workspace',
    icon: <Slack className="h-6 w-6" />,
    connected: true,
    usageCount: 3,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send, receive, and manage emails through workflows',
    icon: <Mail className="h-6 w-6" />,
    connected: false,
  },
  {
    id: 'login',
    name: 'GitHub',
    description: 'Trigger workflows from GitHub events and manage repos',
    icon: <LogIn className="h-6 w-6" />,
    connected: true,
    usageCount: 1,
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Access and update your Figma files and projects',
    icon: <Figma className="h-6 w-6" />,
    connected: false,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments and manage your Stripe account',
    icon: <Square className="h-6 w-6" />,
    connected: true,
    usageCount: 2,
  },
  {
    id: 'custom',
    name: 'Webhook',
    description: 'Integrate with any external service via webhooks',
    icon: <Square className="h-6 w-6" />,
    connected: true,
    usageCount: 5,
  },
];

interface IntegrationsGridProps {
  loading?: boolean;
}

export function IntegrationsGrid({ loading = false }: IntegrationsGridProps) {
  const [searchText, setSearchText] = useState('');

  const filteredIntegrations = mockIntegrations.filter(
    int => int.name.toLowerCase().includes(searchText.toLowerCase()) ||
           int.description.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <LoadingSkeleton count={6}/>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Integrations Marketplace</h2>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="pl-10 transition-all duration-200"
          />
        </div>
      </div>

      {filteredIntegrations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map(integration => (
            <IntegrationCard key={integration.id} {...integration} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No integrations found</p>
        </div>
      )}
    </div>
  );
}
