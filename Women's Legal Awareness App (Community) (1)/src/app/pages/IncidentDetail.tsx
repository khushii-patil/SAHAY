import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, MapPin, FileText, Shield, AlertCircle, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { api } from '../lib/api';

export function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.incidents.getById(id)
      .then(setIncident)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  if (!incident) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Incident not found</h2>
        <Link to="/incidents"><Button className="mt-4">Back to Incident Log</Button></Link>
      </div>
    );
  }

  const evidence = incident.evidence || [];

  return (
    <div className="space-y-6 max-w-4xl pb-4">
      <Link to="/incidents">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4 mr-2" />Back to Incident Log
        </Button>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Incident Details</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="size-3" />{incident.incidentDate} {incident.incidentTime}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="size-3" />{incident.location}
            </Badge>
          </div>
        </div>
        <Link to="/complaints/new" state={{ incidentId: incident._id }}>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <AlertCircle className="size-4 mr-2" />Create Complaint
          </Button>
        </Link>
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="size-5 text-green-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-green-900 text-sm">Tamper-Proof Record</p>
              <p className="text-sm text-green-800 mt-1">Hash verification ensures data integrity.</p>
              <div className="mt-2 p-2 bg-white rounded border border-green-200 overflow-x-auto">
                <p className="text-xs font-mono text-green-900 break-all">Hash: {incident.hash}</p>
                <p className="text-xs font-mono text-green-700 mt-1 break-all">Previous: {incident.previousHash}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incident Report</CardTitle>
          <CardDescription>Logged on {new Date(incident.createdAt).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">Description</p>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{incident.description}</p>
          </div>
          {incident.involvedParties && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Involved Parties</p>
              <p className="mt-1 text-gray-900">{incident.involvedParties}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {[
              { label: 'Date', value: incident.incidentDate },
              { label: 'Time', value: incident.incidentTime },
              { label: 'Location', value: incident.location },
              { label: 'Created', value: new Date(incident.createdAt).toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-600">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />Evidence Files ({evidence.length})
          </CardTitle>
          <CardDescription>All evidence is cryptographically hashed for integrity</CardDescription>
        </CardHeader>
        <CardContent>
          {evidence.length > 0 ? (
            <div className="space-y-3">
              {evidence.map((file: any) => (
                <div key={file._id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                  <div className="size-12 flex items-center justify-center bg-purple-100 rounded shrink-0">
                    <FileText className="size-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.fileName}</p>
                    <p className="text-xs text-gray-600 mt-1">Uploaded: {new Date(file.createdAt).toLocaleString()}</p>
                    <p className="text-xs font-mono text-gray-500 mt-1 truncate">Hash: {file.fileHash?.substring(0, 32)}...</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">{file.fileType?.split('/')[0]}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No evidence files uploaded</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-purple-900 mb-3">What's Next?</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/complaints/new" state={{ incidentId: incident._id }}>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <AlertCircle className="size-4 mr-2" />File Complaint
              </Button>
            </Link>
            <Link to="/legal">
              <Button variant="outline">Learn About Your Rights</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
