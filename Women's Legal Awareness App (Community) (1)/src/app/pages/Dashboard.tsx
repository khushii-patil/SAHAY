import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { BookOpen, FileText, AlertCircle, ShieldAlert, Plus, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { api } from '../lib/api';

export function Dashboard() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    api.incidents.getAll().then(setIncidents).catch(console.error);
    api.complaints.getAll().then(setComplaints).catch(console.error);
  }, []);

  const draftComplaints = complaints.filter(c => c.status === 'pending').length;
  const submittedComplaints = complaints.filter(c => c.status === 'submitted').length;

  const stats = [
    { title: 'Incidents Logged', value: incidents.length, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50', link: '/incidents' },
    { title: 'Complaints Filed', value: complaints.length, icon: AlertCircle, color: 'text-purple-600', bgColor: 'bg-purple-50', link: '/complaints' },
    { title: 'Pending', value: draftComplaints, icon: FileText, color: 'text-orange-600', bgColor: 'bg-orange-50', link: '/complaints' },
    { title: 'Submitted', value: submittedComplaints, icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50', link: '/complaints' },
  ];

  const quickActions = [
    { title: 'Learn Your Rights', description: 'Browse legal knowledge and understand your rights', icon: BookOpen, link: '/legal', color: 'from-blue-600 to-cyan-600' },
    { title: 'Log Incident', description: 'Record and document a new incident', icon: Plus, link: '/incidents/new', color: 'from-purple-600 to-pink-600' },
    { title: 'File Complaint', description: 'Create a formal complaint', icon: AlertCircle, link: '/complaints/new', color: 'from-orange-600 to-red-600' },
    { title: 'SOS Emergency', description: 'Access emergency assistance', icon: ShieldAlert, link: '/emergency', color: 'from-red-600 to-pink-600' },
  ];

  const recentIncidents = incidents.slice(0, 3);

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your safety and support hub</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Link to={stat.link} key={stat.title}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg`}>
                    <stat.icon className={`size-5 sm:size-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link to={action.link} key={action.title}>
              <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-purple-200">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg">{action.title}</CardTitle>
                      <CardDescription className="mt-1 text-sm">{action.description}</CardDescription>
                    </div>
                    <div className={`bg-gradient-to-r ${action.color} p-2 rounded-lg ml-4`}>
                      <action.icon className="size-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Incidents</h2>
          <Link to="/incidents">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        {recentIncidents.length > 0 ? (
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <Link to={`/incidents/${incident._id}`} key={incident._id}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="secondary">{incident.incidentDate}</Badge>
                          <Badge variant="outline" className="truncate max-w-[150px]">{incident.location}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{incident.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No incidents logged yet</p>
              <Link to="/incidents/new">
                <Button className="mt-3" size="sm">Log Your First Incident</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-none">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg shrink-0">
                <ShieldAlert className="size-6 sm:size-8" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold">In case of emergency</h3>
                <p className="text-white/90 text-sm">Access immediate help and alert trusted contacts</p>
              </div>
            </div>
            <Link to="/emergency" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-red-600 hover:bg-white/90">
                SOS Emergency
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
