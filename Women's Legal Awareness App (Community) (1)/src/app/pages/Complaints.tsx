import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, AlertCircle, FileCheck, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { api } from '../lib/api';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'Pending',    color: 'bg-gray-100 text-gray-700',    icon: Clock },
  submitted:  { label: 'Submitted',  color: 'bg-blue-100 text-blue-700',    icon: FileCheck },
  'in-review':{ label: 'In Review',  color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  resolved:   { label: 'Resolved',   color: 'bg-green-100 text-green-700',  icon: CheckCircle2 },
  closed:     { label: 'Closed',     color: 'bg-gray-100 text-gray-600',    icon: CheckCircle2 },
};

export function Complaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.complaints.getAll()
      .then(setComplaints)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.complaints.delete(deleteId);
      setComplaints(prev => prev.filter(c => c._id !== deleteId));
      toast.success('Complaint deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete complaint');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-600 mt-1">File and track formal complaints</p>
        </div>
        <Link to="/complaints/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="size-4 mr-2" />
            <span className="hidden sm:inline">File New Complaint</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Complaints', value: complaints.length, icon: AlertCircle, color: 'text-purple-600' },
          { label: 'Submitted', value: complaints.filter(c => c.status === 'submitted').length, icon: FileCheck, color: 'text-blue-600' },
          { label: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length, icon: CheckCircle2, color: 'text-green-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-600">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></div>
                <Icon className={`size-8 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading complaints...</div>
      ) : complaints.length > 0 ? (
        <div className="space-y-4">
          {complaints.map((complaint) => {
            const config = statusConfig[complaint.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const incident = complaint.incidentId;
            return (
              <Card key={complaint._id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/complaints/${complaint._id}`} className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className={config.color}>
                          <StatusIcon className="size-3 mr-1" />{config.label}
                        </Badge>
                        <Badge variant="outline">{complaint.authorityType?.toUpperCase()}</Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg">Complaint to {complaint.authorityType}</CardTitle>
                      {incident && (
                        <CardDescription className="mt-1 line-clamp-2">
                          Related to incident on {incident.incidentDate} at {incident.location}
                        </CardDescription>
                      )}
                    </Link>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setDeleteId(complaint._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2">
                    <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-purple-100 mb-4">
              <AlertCircle className="size-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Complaints Filed</h3>
            <p className="text-gray-600 mb-6">Create formal complaints to submit to authorities</p>
            <Link to="/complaints/new">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="size-4 mr-2" />File Your First Complaint
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Complaint?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the complaint. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
