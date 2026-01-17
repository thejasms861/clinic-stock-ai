import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatCardProps) => {
  const variants = {
    default: 'bg-card border border-border',
    primary: 'stat-card-primary',
    success: 'stat-card-success',
    warning: 'stat-card-warning',
    danger: 'stat-card-danger',
  };

  const isColored = variant !== 'default';

  return (
    <div className={cn('rounded-xl p-6 transition-all hover:shadow-lg', variants[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn('text-sm font-medium', isColored ? 'text-white/80' : 'text-muted-foreground')}>
            {title}
          </p>
          <p className={cn('text-3xl font-bold', isColored ? 'text-white' : 'text-foreground')}>
            {value}
          </p>
          {subtitle && (
            <p className={cn('text-sm', isColored ? 'text-white/70' : 'text-muted-foreground')}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn('flex items-center gap-1 text-sm', isColored ? 'text-white/80' : '')}>
              <span className={trend.isPositive ? 'text-success' : 'text-destructive'}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span>vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          isColored ? 'bg-white/20' : 'bg-primary/10'
        )}>
          <Icon className={cn('w-6 h-6', isColored ? 'text-white' : 'text-primary')} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
