import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { api, getCurrentUser } from '../lib/api';
import { toast } from 'sonner';

export function Profile() {
  const user = getCurrentUser();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.incidents.getAll().then(setIncidents).catch(console.error);
    api.complaints.getAll().then(setComplaints).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.profile.update(formData);
      localStorage.setItem('sahay_user', JSON.stringify({ ...user, ...updated }));
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold text-gray-900">User not found</h2>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl pb-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Your account information and activity</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </div>
            {!editMode
              ? <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>Edit</Button>
              : <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>Cancel</Button>
                  <Button size="sm" disabled={saving} onClick={handleSave}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
            }
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-14 sm:size-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          {editMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="size-5 text-purple-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="size-5 text-purple-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Your usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: FileText, label: 'Incidents', value: incidents.length, color: 'text-blue-600' },
              { icon: AlertCircle, label: 'Complaints', value: complaints.length, color: 'text-purple-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`size-5 ${color}`} />
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-purple-600" />Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-purple-900">
          {[
            'All your data is stored securely in MongoDB with JWT authentication',
            'Incident records are cryptographically hashed for tamper-proof integrity',
            'Your location is only shared when you explicitly trigger SOS',
            'No data is shared with third parties without your consent',
          ].map((text) => (
            <div key={text} className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5 shrink-0">✓</span>
              <span>{text}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
