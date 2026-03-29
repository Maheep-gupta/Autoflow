'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyCardProps {
  id: string;
  name: string;
  key: string;
  lastUsed?: string;
  createdAt: string;
  isProduction?: boolean;
}

export function ApiKeyCard({ id, name, key, lastUsed, createdAt, isProduction }: ApiKeyCardProps) {
  const [revealed, setRevealed] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Copied!',
      description: 'API key copied to clipboard',
    });
  };

  const maskedKey = revealed ? key : `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`;

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg overflow-hidden group
      ${isProduction ? 'border-orange-500/50 bg-linear-to-br from-orange-500/5 to-transparent' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{name}</CardTitle>
              {isProduction && (
                <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30">
                  Production
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs mt-1">Created {createdAt}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded font-mono text-sm break-all">
          <span className="flex-1">{maskedKey}</span>
          <button
            onClick={() => setRevealed(!revealed)}
            className="p-1 hover:bg-muted rounded transition-colors shrink-0"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-muted rounded transition-colors shrink-0"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        {lastUsed && (
          <p className="text-xs text-muted-foreground">Last used: {lastUsed}</p>
        )}

        <Button
          variant="destructive"
          size="sm"
          className="w-full transition-all duration-200"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Revoke
        </Button>
      </CardContent>
    </Card>
  );
}
