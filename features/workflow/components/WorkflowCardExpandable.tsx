'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/ui/action-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ChevronDown, ChevronUp, Trash2, Share2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowCardExpandableProps {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  lastRun?: {
    status: 'success' | 'failed' | 'running';
    timestamp: string;
  };
  steps: Array<{
    id: string;
    type: string;
    name: string;
  }>;
  triggerCount?: number;
  onRun?: (id: string) => Promise<void>;
  onEdit?: (id: string) => void;
}

export function WorkflowCardExpandable({
  id,
  name,
  description,
  status,
  lastRun,
  steps,
  triggerCount,
  onRun,
  onEdit,
}: WorkflowCardExpandableProps) {
  const [expanded, setExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      toast.success('Workflow started', {
        description: `${name} is now running`,
      });
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to start workflow',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const statusColors = {
    active: 'bg-green-500/10 text-green-700',
    paused: 'bg-yellow-500/10 text-yellow-700',
    error: 'bg-red-500/10 text-red-700',
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer
      ${status === 'active' ? 'border-green-500/50' : 'border-transparent'}`}>
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{name}</CardTitle>
              <Badge className={statusColors[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 p-1 hover:bg-accent rounded transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {lastRun && (
              <>
                <StatusBadge status={lastRun.status} />
                <span className="text-xs text-muted-foreground">{lastRun.timestamp}</span>
              </>
            )}
          </div>
          {triggerCount !== undefined && (
            <span className="text-xs text-muted-foreground">{triggerCount} runs</span>
          )}
        </div>

        {expanded && (
          <div className="border-t pt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Workflow Steps</h4>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2 text-sm">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-600 text-xs font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-muted-foreground text-xs">{step.type}</span>
                    <span className="font-medium">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <ActionButton
            loading={isRunning}
            success={isSuccess}
            onClick={handleRun}
            className="flex-1"
            size="sm"
          >
            Run Now
          </ActionButton>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(id)}
            className="transition-all duration-200"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="transition-all duration-200"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
