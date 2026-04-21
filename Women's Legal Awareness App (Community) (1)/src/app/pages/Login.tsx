import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShieldAlert, Mail, Lock, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { api } from '../lib/api';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type Tab = 'password' | 'otp';
type OtpStep = 'request' | 'verify';

export function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('password');
  const [loading, setLoading] = useState(false);

  // Password login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP login
  const [otpEmail, setOtpEmail] = useState('');
  const [otpStep, setOtpStep] = useState<OtpStep>('request');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // --- Password login ---
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // --- Send OTP ---
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`OTP sent to ${otpEmail}`);
      setOtpStep('verify');
      startCountdown();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // --- Verify OTP and login ---
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { toast.error('Please enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/verify-otp-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const { setToken } = await import('../lib/api');
      setToken(data.token);
      localStorage.setItem('sahay_user', JSON.stringify(data.user));
      toast.success('Login successful!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('New OTP sent!');
      startCountdown();
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP');
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
              SAHAY
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Women Safety & Legal Support Platform
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Tab switcher */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => { setTab('otp'); setOtpStep('request'); setOtp(''); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'otp'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Login with OTP
            </button>
            <button
              onClick={() => setTab('password')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'password'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Login with Password
            </button>
          </div>

          {/* ── PASSWORD LOGIN ── */}
          {tab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setTab('otp'); setOtpStep('request'); }}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Forgot password? Reset via OTP
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          )}

          {/* ── OTP LOGIN ── */}
          {tab === 'otp' && otpStep === 'request' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="otp-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={otpEmail}
                    onChange={e => setOtpEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  A 6-digit OTP will be sent to this email address
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? 'Sending OTP...' : 'Generate OTP'}
              </Button>
            </form>
          )}

          {tab === 'otp' && otpStep === 'verify' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  OTP sent to <strong>{otpEmail}</strong>. Check your inbox.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp-code">Enter 6-digit OTP</Label>
                <Input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="_ _ _ _ _ _"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  required
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">OTP expires in 10 minutes</span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || loading}
                    className={`font-medium ${countdown > 0 ? 'text-gray-400' : 'text-purple-600 hover:underline'}`}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Login'}
              </Button>

              <button
                type="button"
                onClick={() => { setOtpStep('request'); setOtp(''); }}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Use a different email
              </button>
            </form>
          )}

          <div className="text-center text-sm pt-2 border-t border-gray-100">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-purple-600 hover:underline font-semibold">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
