import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import {
  Home, BookOpen, FileText, AlertCircle,
  ShieldAlert, User, LogOut, Menu, X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { isAuthenticated, getCurrentUser, removeToken } from '../lib/api';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Dashboard', exact: true },
  { to: '/legal', icon: BookOpen, label: 'Legal Knowledge' },
  { to: '/incidents', icon: FileText, label: 'Incident Log' },
  { to: '/complaints', icon: AlertCircle, label: 'Complaints' },
];

const BOTTOM_NAV_ITEMS = [
  { to: '/emergency', icon: ShieldAlert, label: 'SOS Emergency', danger: true },
  { to: '/profile', icon: User, label: 'Profile' },
];

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helplines, setHelplines] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    fetch(`${BASE_URL}/helplines`)
      .then(r => r.json())
      .then(data => setHelplines(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => setHelplines([
        { _id: '1', name: 'Emergency', number: '112' },
        { _id: '2', name: 'Women Helpline', number: '181' },
        { _id: '3', name: 'Police', number: '100' },
      ]));
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleLogout = () => { removeToken(); navigate('/login'); };
  const user = getCurrentUser();
  const isActive = (to: string, exact = false) =>
    exact ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + '/');

  const NavContent = () => (
    <>
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
          <Link key={to} to={to}>
            <Button variant={isActive(to, exact) ? 'secondary' : 'ghost'} className="w-full justify-start">
              <Icon className="size-4 mr-3 shrink-0" />
              <span className="truncate">{label}</span>
            </Button>
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-gray-200 mt-4 space-y-1">
        {BOTTOM_NAV_ITEMS.map(({ to, icon: Icon, label, danger }) => (
          <Link key={to} to={to}>
            <Button
              variant={isActive(to) ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${danger ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''}`}
            >
              <Icon className="size-4 mr-3 shrink-0" />
              <span className="truncate">{label}</span>
            </Button>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="text-xs font-semibold text-purple-900 mb-2">Quick Helplines</h3>
        <div className="space-y-1 text-xs">
          {helplines.length > 0 ? helplines.map((h) => (
            <div key={h._id} className="flex justify-between">
              <span className="text-gray-700 truncate mr-2">{h.name}:</span>
              <a href={`tel:${h.number}`} className="text-purple-600 font-semibold hover:underline shrink-0">{h.number}</a>
            </div>
          )) : (
            <>
              <div className="flex justify-between"><span className="text-gray-700">Emergency:</span><a href="tel:112" className="text-purple-600 font-semibold">112</a></div>
              <div className="flex justify-between"><span className="text-gray-700">Women Helpline:</span><a href="tel:181" className="text-purple-600 font-semibold">181</a></div>
              <div className="flex justify-between"><span className="text-gray-700">Police:</span><a href="tel:100" className="text-purple-600 font-semibold">100</a></div>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
                {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                  <ShieldAlert className="size-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">SAHAY</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Women Safety & Support</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm text-gray-700 hidden sm:block truncate max-w-[140px]">Hello, {user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="shrink-0">
                <LogOut className="size-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex max-w-7xl mx-auto">
        <aside className={`fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] z-20 w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}>
          <NavContent />
        </aside>
        <main className="flex-1 p-4 sm:p-6 min-w-0 w-full"><Outlet /></main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex sm:hidden z-30">
        {[...NAV_ITEMS, ...BOTTOM_NAV_ITEMS].slice(0, 5).map(({ to, icon: Icon, label, exact, danger }: any) => (
          <Link key={to} to={to} className="flex-1">
            <div className={`flex flex-col items-center py-2 px-1 text-xs gap-1 ${isActive(to, exact) ? 'text-purple-600' : danger ? 'text-red-500' : 'text-gray-500'}`}>
              <Icon className="size-5" />
              <span className="truncate w-full text-center leading-tight">{label.split(' ')[0]}</span>
            </div>
          </Link>
        ))}
      </nav>
      <div className="h-16 sm:hidden" />
    </div>
  );
}
