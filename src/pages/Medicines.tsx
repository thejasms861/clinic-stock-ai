import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from 'lucide-react';

const Medicines = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Pill className="w-7 h-7 text-primary" />
            Medicine Master
          </h1>
          <p className="text-muted-foreground">
            Manage your medicine catalog and product information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Medicine Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will contain the master medicine catalog with generic names, 
              manufacturers, and default configurations. Coming soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Medicines;
