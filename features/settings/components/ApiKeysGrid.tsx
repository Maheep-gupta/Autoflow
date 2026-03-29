'use client';

import React from 'react';
import { ApiKeyCard } from '@/features/settings/components/ApiKeyCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Key, Plus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const mockApiKeys = [
  {
    id: '1',
    name: 'Production API Key',
    apiKey:'abc',
    lastUsed: '2 hours ago',
    createdAt: '2024-01-15',
    isProduction: true,
  },
  {
    id: '2',
    name: 'Development Key',
    apiKey: 'abc',
    lastUsed: '30 minutes ago',
    createdAt: '2024-01-20',
    isProduction: false,
  },
];

interface ApiKeysGridProps {
  loading?: boolean;
}

export function ApiKeysGrid({ loading = false }: ApiKeysGridProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const { toast } = useToast();

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the API key',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'API Key created',
      description: `"${newKeyName}" has been generated`,
    });

    setCreateDialogOpen(false);
    setNewKeyName('');
  };

  if (loading) {
    return <LoadingSkeleton count={2} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your API keys for programmatic access</p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Key
        </Button>
      </div>

      {mockApiKeys.length > 0 ? (
        <div className="grid gap-4">
          {mockApiKeys.map(key => (
            <ApiKeyCard key={key.id} {...key} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Key}
          title="No API keys"
          description="Create your first API key to get started"
          action={{ label: 'Create API Key', onClick: () => setCreateDialogOpen(true) }}
        />
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>Create a new API key for programmatic access</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production Key, Staging Key"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Give your key a descriptive name</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateKey}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
