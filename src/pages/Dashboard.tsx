import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import AlertsList from '@/components/dashboard/AlertsList';
import ConsumptionChart from '@/components/dashboard/ConsumptionChart';
import InventoryTable from '@/components/dashboard/InventoryTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  AlertTriangle,
  Clock,
  TrendingUp,
  IndianRupee,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { mockInventory, mockAlerts, mockConsumptionData, dashboardStats } from '@/lib/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your inventory overview.
            </p>
          </div>
          <Button onClick={() => navigate('/forecasting')} className="gap-2">
            <Sparkles className="w-4 h-4" />
            View AI Forecasts
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Medicines"
            value={dashboardStats.totalMedicines}
            subtitle="Active SKUs in inventory"
            icon={Package}
            variant="primary"
          />
          <StatCard
            title="Low Stock Items"
            value={dashboardStats.lowStockItems}
            subtitle="Need immediate attention"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Expiring Soon"
            value={dashboardStats.expiringItems}
            subtitle="Within next 30 days"
            icon={Clock}
            variant="danger"
          />
          <StatCard
            title="Inventory Value"
            value={formatCurrency(dashboardStats.totalValue)}
            subtitle="Total stock value"
            icon={IndianRupee}
            trend={{ value: 8.2, isPositive: true }}
          />
        </div>

        {/* Charts & Alerts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Consumption Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Consumption Trends & Forecast
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/forecasting')}>
                  Details <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <ConsumptionChart data={mockConsumptionData} />
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI-generated forecast based on historical consumption patterns
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Panel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Active Alerts
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/alerts')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <AlertsList alerts={mockAlerts.slice(0, 4)} />
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Inventory Overview</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/inventory')}>
              Manage Inventory <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <InventoryTable items={mockInventory} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
