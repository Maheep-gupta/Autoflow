'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IntegrationCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  usageCount?: number;
  requiresAuth?: boolean;
}

export function IntegrationCard({
  id,
  name,
  description,
  icon,
  connected,
  usageCount,
  requiresAuth = true,
}: IntegrationCardProps) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setAuthLoading(true);
    try {
      // Simulate auth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: 'Connected!',
        description: `${name} has been successfully connected`,
      });
      setAuthDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: `Could not connect to ${name}`,
        variant: 'destructive',
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <Card
        className={`relative overflow-hidden transition-all duration-300 group
        ${connected ? 'border-green-500/50 bg-linear-to-br from-green-500/5 to-transparent' : 'border-muted-foreground/20 opacity-75 hover:opacity-100'}`}
      >
        <div
          className={`absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${connected ? '' : ''}`}
        />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">{icon}</div>
              <div>
                <CardTitle className="text-base inline-flex items-center gap-2">
                  {name}
                  {connected && (
                    <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-xs mt-1">{description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {usageCount !== undefined && connected && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Used in {usageCount} workflow{usageCount !== 1 ? 's' : ''}</span>
            </div>
          )}

          <Button
            onClick={() => setAuthDialogOpen(true)}
            variant={connected ? 'outline' : 'default'}
            className="w-full transition-all duration-200"
          >
            {connected ? 'Reconfigure' : 'Connect'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authorize {name}</DialogTitle>
            <DialogDescription>Follow the steps to connect your {name} account</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Authorization Code</label>
              <Input placeholder="Paste the code from the authorization window" />
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
              <p className="text-xs text-blue-700">
                A new window will open to authorize {name}. Please grant permission and paste the code above.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAuthDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={authLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {authLoading ? 'Authorizing...' : 'Authorize'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
