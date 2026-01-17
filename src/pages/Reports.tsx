import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, TrendingUp, Package, AlertTriangle } from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  const reports = [
    {
      title: 'Inventory Summary',
      description: 'Complete stock overview with quantities and values',
      icon: Package,
      type: 'inventory',
    },
    {
      title: 'Consumption Report',
      description: 'Historical consumption patterns and trends',
      icon: TrendingUp,
      type: 'consumption',
    },
    {
      title: 'Expiry Report',
      description: 'Medicines expiring in the next 90 days',
      icon: Calendar,
      type: 'expiry',
    },
    {
      title: 'Alerts Summary',
      description: 'All alerts and actions taken',
      icon: AlertTriangle,
      type: 'alerts',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Generate and export reports for audits and planning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <Card key={report.type} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <report.icon className="w-5 h-5 text-primary" />
                  {report.title}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
