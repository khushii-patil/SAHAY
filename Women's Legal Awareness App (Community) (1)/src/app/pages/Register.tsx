import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShieldAlert, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { api } from '../lib/api';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.auth.register(formData.name, formData.email, formData.phone, formData.password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl">
              <ShieldAlert className="size-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Join SAHAY for safety and support
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { id: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'Your full name' },
              { id: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'your.email@example.com' },
              { id: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+91 98765 43210' },
              { id: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: '••••••••' },
              { id: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: Lock, placeholder: '••••••••' },
            ].map(({ id, label, type, icon: Icon, placeholder }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <div className="relative">
                  <Icon className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            ))}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-purple-600 hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
