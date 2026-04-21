import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { api } from '../lib/api';
import { toast } from 'sonner';

export function CreateComplaint() {
  const navigate = useNavigate();
  const location = useLocation();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(location.state?.incidentId || '');
  const [authorityType, setAuthorityType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.incidents.getAll().then(setIncidents).catch(console.error);
  }, []);

  const selectedIncident = incidents.find(i => i._id === selectedIncidentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentId || !authorityType) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const complaint = await api.complaints.create({ incidentId: selectedIncidentId, authorityType, notes });
      toast.success('Complaint created successfully');
      navigate(`/complaints/${complaint._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl pb-4">
      <Link to="/complaints">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4 mr-2" />Back to Complaints
        </Button>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">File New Complaint</h1>
        <p className="text-gray-600 mt-1">Create a formal complaint based on logged incidents</p>
      </div>

      {incidents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="size-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Incidents Available</h3>
            <p className="text-gray-600 mb-6">You need to log an incident before filing a complaint</p>
            <Link to="/incidents/new">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Log an Incident First
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Incident</CardTitle>
              <CardDescription>Choose which incident this complaint relates to</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="incident">Related Incident *</Label>
                <Select value={selectedIncidentId} onValueChange={setSelectedIncidentId}>
                  <SelectTrigger id="incident">
                    <SelectValue placeholder="Select an incident" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidents.map((incident) => (
                      <SelectItem key={incident._id} value={incident._id}>
                        {incident.incidentDate} — {incident.location} — {incident.description.substring(0, 40)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedIncident && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Incident Preview</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Date:</span> {selectedIncident.incidentDate} {selectedIncident.incidentTime}</p>
                      <p><span className="text-gray-600">Location:</span> {selectedIncident.location}</p>
                      <p><span className="text-gray-600">Description:</span> {selectedIncident.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Complaint Details</CardTitle>
              <CardDescription>Specify where to submit this complaint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authority">Authority Type *</Label>
                <Select value={authorityType} onValueChange={setAuthorityType}>
                  <SelectTrigger id="authority">
                    <SelectValue placeholder="Select authority type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="police">Police Department</SelectItem>
                    <SelectItem value="workplace-icc">Workplace ICC</SelectItem>
                    <SelectItem value="ngo">NGO / Women's Organization</SelectItem>
                    <SelectItem value="legal-aid">Legal Aid Services</SelectItem>
                    <SelectItem value="cyber-cell">Cyber Crime Cell</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Details (Optional)</Label>
                <Textarea id="notes" placeholder="Add any additional information..."
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  rows={4} className="resize-none" />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Link to="/complaints">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              {loading ? 'Creating...' : 'Create Complaint'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
