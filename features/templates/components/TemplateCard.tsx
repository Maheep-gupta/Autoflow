'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  isPopular?: boolean;
  steps: Array<{
    name: string;
    type: string;
  }>;
  icon?: React.ReactNode;
}

export function TemplateCard({
  id,
  title,
  description,
  category,
  isPopular,
  steps,
  icon,
}: TemplateCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            {icon && <div className="mt-1">{icon}</div>}
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{title}</CardTitle>
                {isPopular && (
                  <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/30">
                    ⭐ Popular
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">{category}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Steps ({steps.length})</p>
          <div className="space-y-1">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 text-xs shrink-0">
                  {index + 1}
                </div>
                <span className="text-muted-foreground">{step.type}</span>
                <span className="font-medium flex-1 truncate">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200">
          <Copy className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </CardContent>
    </Card>
  );
}
