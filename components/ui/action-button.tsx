'use client';

import React, { useState } from 'react';
import { Button, ButtonProps } from './button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface ActionButtonProps extends ButtonProps {
  loading?: boolean;
  success?: boolean;
  onSuccess?: () => void;
  label?: string;
  children?: React.ReactNode;
}

export function ActionButton({
  loading = false,
  success = false,
  onSuccess,
  label = 'Run Now',
  children,
  ...props
}: ActionButtonProps) {
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    if (success && !isSuccess) {
      setIsSuccess(true);
      onSuccess?.();
      const timer = setTimeout(() => setIsSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, isSuccess, onSuccess]);

  if (isSuccess) {
    return (
      <Button
        disabled
        className="bg-green-600 hover:bg-green-600 transition-all duration-200"
        {...props}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Success!
      </Button>
    );
  }

  if (loading) {
    return (
      <Button disabled className="transition-all duration-200" {...props}>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Running...
      </Button>
    );
  }

  return (
    <Button className="transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25" {...props}>
      {children || label}
    </Button>
  );
}
