'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExecutionRowExpandableProps {
  id: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  duration?: string;
  triggerType: string;
  steps: Array<{
    name: string;
    status: 'success' | 'failed' | 'running' | 'pending';
    duration: string;
    error?: string;
  }>;
}

export function ExecutionRowExpandable({
  id,
  workflowName,
  status,
  startTime,
  duration,
  triggerType,
  steps,
}: ExecutionRowExpandableProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="space-y-0">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 p-4 bg-card hover:bg-accent transition-colors cursor-pointer border rounded-lg group"
      >
        <button className="p-1 hover:bg-muted rounded transition-colors">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <div className="flex-1 grid grid-cols-4 gap-4">
          <div>
            <p className="font-medium text-sm">{workflowName}</p>
            <p className="text-xs text-muted-foreground">{triggerType}</p>
          </div>
          <div>
            <StatusBadge status={status} showLabel />
          </div>
          <div>
            <p className="text-sm">{startTime}</p>
            {duration && <p className="text-xs text-muted-foreground">{duration}</p>}
          </div>
          <div>
            <span className="text-xs bg-muted px-2 py-1 rounded">{id}</span>
          </div>
        </div>
      </div>

      {expanded && (
        <Card className="rounded-0 border-t-0 animate-in fade-in slide-in-from-top-2 duration-300">
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold text-sm">Execution Steps</h4>
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted shrink-0 text-xs font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{step.name}</span>
                    <StatusBadge status={step.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{step.duration}</p>
                  {step.error && (
                    <p className="text-xs text-red-600 mt-1 font-mono">{step.error}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
