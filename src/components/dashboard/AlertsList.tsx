import { AlertTriangle, Clock, TrendingDown, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'low_stock' | 'expiry_warning' | 'overstock' | 'stockout';
  message: string;
  medicineName: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
}

interface AlertsListProps {
  alerts: Alert[];
}

const AlertsList = ({ alerts }: AlertsListProps) => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'stockout':
        return <Package className="w-4 h-4" />;
      case 'low_stock':
        return <TrendingDown className="w-4 h-4" />;
      case 'expiry_warning':
        return <Clock className="w-4 h-4" />;
      case 'overstock':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'alert-critical';
      case 'medium':
        return 'alert-warning';
      case 'low':
        return 'alert-info';
    }
  };

  const getIconColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-info';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No alerts at this time</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={cn('rounded-lg p-4 transition-all hover:shadow-sm', getAlertStyles(alert.severity))}
        >
          <div className="flex items-start gap-3">
            <div className={cn('mt-0.5', getIconColor(alert.severity))}>
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{alert.medicineName}</p>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertsList;
