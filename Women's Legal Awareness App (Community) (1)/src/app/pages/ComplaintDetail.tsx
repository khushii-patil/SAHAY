// ComplaintDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, FileText, Download, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { api, getCurrentUser } from '../lib/api';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Pending',    color: 'bg-gray-100 text-gray-700' },
  submitted:  { label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  'in-review':{ label: 'In Review', color: 'bg-yellow-100 text-yellow-700' },
  resolved:   { label: 'Resolved',  color: 'bg-green-100 text-green-700' },
  closed:     { label: 'Closed',    color: 'bg-gray-100 text-gray-600' },
};

export function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!id) return;
    api.complaints.getById(id).then(setComplaint).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!complaint) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold text-gray-900">Complaint not found</h2>
      <Link to="/complaints"><Button className="mt-4">Back to Complaints</Button></Link>
    </div>
  );

  const incident = complaint.incidentId;
  const config = statusConfig[complaint.status] || statusConfig.pending;

  const handleUpdateStatus = async (status: string) => {
    try {
      const updated = await api.complaints.updateStatus(complaint._id, status);
      setComplaint(updated);
      toast.success(`Complaint marked as ${status}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('FORMAL COMPLAINT', doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 15; doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Complaint ID: ${complaint._id}`, margin, y); y += 7;
    doc.text(`Date: ${new Date(complaint.createdAt).toLocaleDateString()}`, margin, y); y += 7;
    doc.text(`Authority: ${complaint.authorityType?.toUpperCase()}`, margin, y); y += 15;
    doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('COMPLAINANT DETAILS', margin, y); y += 10;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${user?.name}`, margin, y); y += 7;
    doc.text(`Email: ${user?.email}`, margin, y); y += 15;
    if (incident) {
      doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.text('INCIDENT DETAILS', margin, y); y += 10;
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${incident.incidentDate} at ${incident.incidentTime}`, margin, y); y += 7;
      doc.text(`Location: ${incident.location}`, margin, y); y += 7;
      const lines = doc.splitTextToSize(incident.description, doc.internal.pageSize.getWidth() - 2 * margin);
      doc.text(lines, margin, y);
    }
    doc.save(`complaint-${complaint._id}.pdf`);
    toast.success('Complaint exported as PDF');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-4">
      <Link to="/complaints">
        <Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-2" />Back to Complaints</Button>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Badge className={`${config.color} mb-2`}>{config.label}</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Complaint Details</h1>
          <p className="text-gray-600 mt-1">To {complaint.authorityType}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="size-4 mr-2" />Export PDF
          </Button>
          {complaint.status === 'pending' && (
            <Button onClick={() => handleUpdateStatus('submitted')} className="bg-blue-600 hover:bg-blue-700">
              <Send className="size-4 mr-2" />Mark Submitted
            </Button>
          )}
          {complaint.status === 'submitted' && (
            <Button onClick={() => handleUpdateStatus('resolved')} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="size-4 mr-2" />Mark Resolved
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Complaint Information</CardTitle>
          <CardDescription>Created on {new Date(complaint.createdAt).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Authority Type', value: complaint.authorityType?.replace('-', ' ') },
              { label: 'Status', value: <Badge className={config.color}>{config.label}</Badge> },
              { label: 'Created', value: new Date(complaint.createdAt).toLocaleString() },
              { label: 'Last Updated', value: new Date(complaint.updatedAt).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="mt-1 text-gray-900 capitalize">{value as any}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {incident && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="size-5" />Related Incident</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Description</p>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{incident.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              {[
                { label: 'Date', value: incident.incidentDate },
                { label: 'Time', value: incident.incidentTime },
                { label: 'Location', value: incident.location },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-600">{label}</p>
                  <p className="text-sm font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
