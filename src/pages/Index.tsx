import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, Bell, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    { icon: Package, title: 'Smart Inventory', description: 'Real-time stock tracking with batch and expiry management' },
    { icon: TrendingUp, title: 'AI Forecasting', description: 'Predict demand 4-12 weeks ahead using historical data' },
    { icon: Bell, title: 'Proactive Alerts', description: 'Stockout, expiry, and overstock notifications' },
    { icon: Shield, title: 'Role-Based Access', description: 'Secure access for admins, pharmacy & store managers' },
  ];

  const benefits = [
    'Prevent costly stockouts with predictive analytics',
    'Reduce expired medicine losses by 40%',
    'Optimize reorder quantities automatically',
    'Complete audit trail for compliance',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="stat-card-primary">
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">ClinicInventory</span>
              <p className="text-white/70 text-sm">Forecast Suite</p>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              AI-Powered Medicine Inventory for Indian Healthcare
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Prevent stockouts, reduce wastage, and optimize pharmacy operations with intelligent demand forecasting designed for hospitals and clinics across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90 gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card-elevated rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Why Choose ClinicInventory?</h2>
            <div className="space-y-4 text-left">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="mt-8" onClick={() => navigate('/auth')}>
              Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2024 ClinicInventory Forecast Suite. Built for Indian Healthcare.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
