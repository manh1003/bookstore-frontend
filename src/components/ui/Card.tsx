import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = ({ children, className, padding = 'md' }: CardProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(
      'rounded-lg border border-gray-200 bg-white shadow-sm',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
);

const CardDescription = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn('text-sm text-gray-600', className)}>
    {children}
  </p>
);

const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('pt-0', className)}>
    {children}
  </div>
);

const CardFooter = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex items-center pt-4', className)}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };