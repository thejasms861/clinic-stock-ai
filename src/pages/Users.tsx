import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
import { Users, UserPlus, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'pharmacy_manager' | 'store_manager' | null;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hospital.com',
    fullName: 'Dr. Priya Sharma',
    role: 'admin',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'pharmacy@hospital.com',
    fullName: 'Rajesh Kumar',
    role: 'pharmacy_manager',
    createdAt: '2024-01-05',
  },
  {
    id: '3',
    email: 'store@hospital.com',
    fullName: 'Amit Patel',
    role: 'store_manager',
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    email: 'new@hospital.com',
    fullName: 'Neha Singh',
    role: null,
    createdAt: '2024-01-15',
  },
];

const UsersPage = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);

  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  if (!loading && !isAdmin) {
    navigate('/dashboard');
    return null;
  }

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary">Admin</Badge>;
      case 'pharmacy_manager':
        return <Badge variant="secondary">Pharmacy Manager</Badge>;
      case 'store_manager':
        return <Badge variant="outline">Store Manager</Badge>;
      default:
        return <Badge variant="destructive">No Role</Badge>;
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole as User['role'] } : u
    ));
    toast.success('User role updated successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-7 h-7 text-primary" />
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage user accounts and assign roles
            </p>
          </div>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              All Users
            </CardTitle>
            <CardDescription>
              Assign roles to control what each user can access and modify
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} className="table-row-hover">
                      <TableCell className="font-medium">{u.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>{getRoleBadge(u.role)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.role || ''}
                          onValueChange={(value) => handleRoleChange(u.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Assign role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="pharmacy_manager">Pharmacy Manager</SelectItem>
                            <SelectItem value="store_manager">Store Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Roles Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Badge className="bg-primary mb-2">Admin</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full access to all features</li>
                  <li>• Manage users and roles</li>
                  <li>• Delete medicines and data</li>
                  <li>• Access all reports</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-secondary border border-border">
                <Badge variant="secondary" className="mb-2">Pharmacy Manager</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Add and edit medicines</li>
                  <li>• View and manage forecasts</li>
                  <li>• Handle reorder operations</li>
                  <li>• View consumption data</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-muted border border-border">
                <Badge variant="outline" className="mb-2">Store Manager</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Update stock levels</li>
                  <li>• Add batch details</li>
                  <li>• Update expiry dates</li>
                  <li>• View inventory reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
