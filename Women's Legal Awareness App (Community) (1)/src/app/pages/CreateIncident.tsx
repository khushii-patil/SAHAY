import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Upload, X, FileText, Image, Music } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface UploadedFile { id: string; file: File; preview?: string; }

export function CreateIncident() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    incidentDate: '', incidentTime: '', location: '', description: '', involvedParties: '',
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map(file => {
      const uploaded: UploadedFile = { id: `${Date.now()}-${Math.random()}`, file };
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFiles(prev => prev.map(f => f.id === uploaded.id ? { ...f, preview: ev.target?.result as string } : f));
        };
        reader.readAsDataURL(file);
      }
      return uploaded;
    });
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const incident = await api.incidents.create(formData);
      // Upload evidence files
      for (const f of files) {
        await api.incidents.uploadEvidence(incident._id, f.file);
      }
      toast.success('Incident logged successfully with tamper-proof security');
      navigate(`/incidents/${incident._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to log incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('audio/')) return Music;
    return FileText;
  };

  return (
    <div className="space-y-6 max-w-3xl pb-4">
      <Link to="/incidents">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4 mr-2" />Back to Incident Log
        </Button>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Log New Incident</h1>
        <p className="text-gray-600 mt-1">Document the incident with date, time, location, and evidence</p>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-900">
            <strong>Privacy & Security:</strong> Your incident report will be cryptographically hashed to create a tamper-proof record.
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>Provide accurate information about the incident</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incidentDate">Date of Incident *</Label>
                <Input id="incidentDate" name="incidentDate" type="date"
                  value={formData.incidentDate} onChange={handleChange}
                  required max={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentTime">Time of Incident *</Label>
                <Input id="incidentTime" name="incidentTime" type="time"
                  value={formData.incidentTime} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" type="text"
                placeholder="Exact location where incident occurred"
                value={formData.location} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea id="description" name="description"
                placeholder="Describe what happened in detail..."
                value={formData.description} onChange={handleChange}
                rows={6} required className="resize-none" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="involvedParties">Involved Parties</Label>
              <Input id="involvedParties" name="involvedParties" type="text"
                placeholder="Names of people involved (if known)"
                value={formData.involvedParties} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Evidence</CardTitle>
            <CardDescription>Upload photos, audio recordings, or documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
                <Upload className="size-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Choose Files to Upload</span>
              </Label>
              <Input id="file-upload" type="file" multiple accept="image/*,audio/*,.pdf,.doc,.docx"
                onChange={handleFileUpload} className="hidden" />
              <p className="text-xs text-gray-500 mt-2">Supported: Images, Audio, PDF, Documents (max 10MB each)</p>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Files ({files.length})</p>
                {files.map((f) => {
                  const FileIcon = getFileIcon(f.file.type);
                  return (
                    <div key={f.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                      {f.preview
                        ? <img src={f.preview} alt="" className="size-12 object-cover rounded" />
                        : <div className="size-12 flex items-center justify-center bg-purple-100 rounded">
                            <FileIcon className="size-6 text-purple-600" />
                          </div>}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{f.file.name}</p>
                        <p className="text-xs text-gray-500">{(f.file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">{f.file.type.split('/')[0]}</Badge>
                      <Button type="button" variant="ghost" size="sm"
                        onClick={() => setFiles(files.filter(x => x.id !== f.id))}>
                        <X className="size-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Link to="/incidents">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            {isSubmitting ? 'Logging Incident...' : 'Log Incident'}
          </Button>
        </div>
      </form>
    </div>
  );
}
