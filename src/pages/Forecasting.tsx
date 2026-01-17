import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ConsumptionChart from '@/components/dashboard/ConsumptionChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  Sparkles,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
} from 'lucide-react';
import { mockForecastData, mockConsumptionData } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Forecasting = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [forecastPeriod, setForecastPeriod] = useState('4');

  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  const getStockStatus = (daysUntilStockout: number) => {
    if (daysUntilStockout <= 14) return { label: 'Critical', color: 'badge-danger' };
    if (daysUntilStockout <= 30) return { label: 'Low', color: 'badge-warning' };
    return { label: 'Healthy', color: 'badge-success' };
  };

  const handleReorder = (medicineName: string, quantity: number) => {
    toast.success(`Reorder initiated for ${medicineName}: ${quantity} units`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-7 h-7 text-primary" />
              AI Demand Forecasting
            </h1>
            <p className="text-muted-foreground">
              Predictive analytics to optimize your inventory levels
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Forecast Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">Next 4 Weeks</SelectItem>
                <SelectItem value="8">Next 8 Weeks</SelectItem>
                <SelectItem value="12">Next 12 Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Insight Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Based on historical consumption patterns and seasonal trends, our AI predicts you'll need to reorder 
                  <span className="font-semibold text-foreground"> 3 critical medicines</span> within the next 2 weeks to avoid stockouts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Overall Consumption Trend
              </CardTitle>
              <CardDescription>
                Historical consumption vs AI-predicted demand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumptionChart data={mockConsumptionData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Reorder Summary</CardTitle>
              <CardDescription>
                Medicines requiring attention based on forecast
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-medium text-foreground">Critical Stock</p>
                      <p className="text-sm text-muted-foreground">Immediate reorder needed</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-destructive">2</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-warning" />
                    <div>
                      <p className="font-medium text-foreground">Low Stock</p>
                      <p className="text-sm text-muted-foreground">Reorder within 2 weeks</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-warning">1</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium text-foreground">Healthy Stock</p>
                      <p className="text-sm text-muted-foreground">No action needed</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-success">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forecast Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Reorder Recommendations
            </CardTitle>
            <CardDescription>
              AI-calculated optimal reorder quantities based on {forecastPeriod}-week forecast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Medicine</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Weekly Usage</TableHead>
                    <TableHead className="text-right">Forecasted Demand</TableHead>
                    <TableHead className="text-right">Days Until Stockout</TableHead>
                    <TableHead className="text-center">Confidence</TableHead>
                    <TableHead className="text-right">Recommended Order</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockForecastData.map((item) => {
                    const status = getStockStatus(item.daysUntilStockout);
                    return (
                      <TableRow key={item.id} className="table-row-hover">
                        <TableCell className="font-medium">{item.medicineName}</TableCell>
                        <TableCell className="text-right">{item.currentStock}</TableCell>
                        <TableCell className="text-right">{item.weeklyConsumption}</TableCell>
                        <TableCell className="text-right">{item.forecastedDemand}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={cn('border', status.color)}>
                            {item.daysUntilStockout} days
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-sm font-medium">{item.confidence}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {item.recommendedOrder > 0 ? (
                            <span className="text-primary">{item.recommendedOrder} units</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.recommendedOrder > 0 && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReorder(item.medicineName, item.recommendedOrder)}
                            >
                              Reorder
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Forecasts are AI-generated estimates based on historical consumption data. Actual demand may vary.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
