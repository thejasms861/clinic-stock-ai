import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  AlertTriangle,
  Clock,
  TrendingDown,
  Package,
  CheckCircle,
  X,
  MessageCircle,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'low_stock' | 'expiry_warning' | 'overstock' | 'stockout';
  medicineName: string;
  message: string;
  details: string;
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
  isRead: boolean;
  isResolved: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'stockout',
    medicineName: 'Insulin Glargine 100U/ml',
    message: 'Stock critically low - immediate action required',
    details: 'Current stock: 45 units. Daily consumption: 25 units. Expected stockout in 2 days.',
    severity: 'high',
    createdAt: '2024-01-15T10:30:00',
    isRead: false,
    isResolved: false,
  },
  {
    id: '2',
    type: 'expiry_warning',
    medicineName: 'Diclofenac Gel 30g',
    message: 'Batch expiring soon',
    details: 'Batch DCL-2024-023 expires on Feb 15, 2024. 120 units remaining.',
    severity: 'high',
    createdAt: '2024-01-15T09:00:00',
    isRead: false,
    isResolved: false,
  },
  {
    id: '3',
    type: 'low_stock',
    medicineName: 'Amoxicillin 250mg',
    message: 'Stock below reorder level',
    details: 'Current stock: 180 units. Reorder level: 200 units. Recommended order: 360 units.',
    severity: 'medium',
    createdAt: '2024-01-14T16:45:00',
    isRead: true,
    isResolved: false,
  },
  {
    id: '4',
    type: 'low_stock',
    medicineName: 'Ciprofloxacin Eye Drops',
    message: 'Stock approaching reorder level',
    details: 'Current stock: 65 units. Reorder level: 80 units.',
    severity: 'medium',
    createdAt: '2024-01-14T14:20:00',
    isRead: true,
    isResolved: false,
  },
  {
    id: '5',
    type: 'overstock',
    medicineName: 'Vitamin D3 Supplements',
    message: 'Excess inventory detected',
    details: 'Current stock: 5000 units. Monthly consumption: 200 units. 25 months of stock on hand.',
    severity: 'low',
    createdAt: '2024-01-13T11:00:00',
    isRead: true,
    isResolved: false,
  },
];

const Alerts = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [activeTab, setActiveTab] = useState('all');

  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'stockout':
        return <Package className="w-5 h-5" />;
      case 'low_stock':
        return <TrendingDown className="w-5 h-5" />;
      case 'expiry_warning':
        return <Clock className="w-5 h-5" />;
      case 'overstock':
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return { bg: 'alert-critical', icon: 'text-destructive', badge: 'badge-danger' };
      case 'medium':
        return { bg: 'alert-warning', icon: 'text-warning', badge: 'badge-warning' };
      case 'low':
        return { bg: 'alert-info', icon: 'text-info', badge: 'badge-info' };
    }
  };

  const getAlertTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'stockout':
        return 'Stockout Risk';
      case 'low_stock':
        return 'Low Stock';
      case 'expiry_warning':
        return 'Expiry Warning';
      case 'overstock':
        return 'Overstock';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isResolved: true } : a));
    toast.success('Alert marked as resolved');
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Alert dismissed');
  };

  const sendWhatsAppNotification = (medicineName: string) => {
    toast.success(`WhatsApp notification sent for ${medicineName}`);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'all') return !alert.isResolved;
    if (activeTab === 'unread') return !alert.isRead && !alert.isResolved;
    if (activeTab === 'resolved') return alert.isResolved;
    return alert.type === activeTab && !alert.isResolved;
  });

  const unreadCount = alerts.filter(a => !a.isRead && !a.isResolved).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="w-7 h-7 text-primary" />
              Alerts & Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">{unreadCount} new</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Stay informed about inventory issues and take timely action
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Smartphone className="w-4 h-4" />
              SMS Settings
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Settings
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All Active</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="stockout">Stockout</TabsTrigger>
            <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
            <TabsTrigger value="expiry_warning">Expiry</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">
                    No alerts in this category. Your inventory is in good shape.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => {
                  const styles = getAlertStyles(alert.severity);
                  return (
                    <Card
                      key={alert.id}
                      className={cn(
                        'transition-all hover:shadow-md',
                        styles.bg,
                        !alert.isRead && 'ring-2 ring-primary/20'
                      )}
                      onClick={() => markAsRead(alert.id)}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-start gap-4">
                          <div className={cn('mt-1', styles.icon)}>
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">
                                {alert.medicineName}
                              </h4>
                              <Badge className={cn('border text-xs', styles.badge)}>
                                {getAlertTypeLabel(alert.type)}
                              </Badge>
                              {!alert.isRead && (
                                <Badge variant="secondary" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-foreground mb-1">
                              {alert.message}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              {alert.details}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(alert.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!alert.isResolved && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sendWhatsAppNotification(alert.medicineName);
                                  }}
                                  className="gap-1"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  Notify
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    resolveAlert(alert.id);
                                  }}
                                >
                                  Resolve
                                </Button>
                              </>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissAlert(alert.id);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
