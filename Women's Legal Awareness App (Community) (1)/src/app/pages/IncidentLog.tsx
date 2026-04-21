import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, FileText, Calendar, MapPin, Shield, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { api } from '../lib/api';
import { toast } from 'sonner';

export function IncidentLog() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.incidents.getAll()
      .then(setIncidents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.incidents.delete(deleteId);
      setIncidents(prev => prev.filter(i => i._id !== deleteId));
      toast.success('Incident deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete incident');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Incident Log</h1>
          <p className="text-gray-600 mt-1">Securely document and preserve evidence</p>
        </div>
        <Link to="/incidents/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="size-4 mr-2" />
            <span className="hidden sm:inline">Log New Incident</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="size-5 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800">
              <strong className="text-blue-900">Tamper-Proof & Secure:</strong> All incidents are timestamped and cryptographically hashed to ensure legal integrity.
            </p>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading incidents...</div>
      ) : incidents.length > 0 ? (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Card key={incident._id} className="hover:shadow-lg transition-all border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/incidents/${incident._id}`} className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                        <Calendar className="size-3" />{incident.incidentDate}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="size-3 shrink-0" />{incident.location}
                      </Badge>
                    </div>
                    <CardTitle className="text-base sm:text-lg mb-1">Incident Report</CardTitle>
                    <CardDescription className="line-clamp-2">{incident.description}</CardDescription>
                  </Link>
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => setDeleteId(incident._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <FileText className="size-4" />{incident.evidence?.length ?? 0} evidence file(s)
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{incident.hash?.substring(0, 12)}...</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-purple-100 mb-4">
              <FileText className="size-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Incidents Logged</h3>
            <p className="text-gray-600 mb-6">Start documenting incidents to build a secure, tamper-proof record</p>
            <Link to="/incidents/new">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="size-4 mr-2" />Log Your First Incident
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Incident?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the incident and all associated evidence files. This action cannot be undone.
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
