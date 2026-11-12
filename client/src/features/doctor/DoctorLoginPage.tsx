import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { doctorApi } from '../../services/portalApi';
import { useAuthStore } from '../../store/authStore';
import { NeulensLogoMark } from '../../components/NeulensLogoMark';
import { NeulensWordmark } from '../../components/NeulensWordmark';
import { PortalIllustration } from '../../components/PortalIllustration';

export const DoctorLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await doctorApi.login(email.trim(), password);
      login(res.doctor);
      navigate('/doctor/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid clinician credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="portal-login-page">
      <header className="portal-login-header">
        <Link to="/" className="portal-brand" aria-label="NeuLens home">
          <NeulensLogoMark className="h-9 w-9" />
          <NeulensWordmark size="small" />
        </Link>
        <Link to="/patient" className="portal-back-link">
          <ArrowLeft className="h-4 w-4" />
          <span>Patient portal</span>
        </Link>
      </header>

      <main className="portal-login-main">
        <PortalIllustration variant="clinician" />

        <section className="portal-login-card" aria-labelledby="clinician-login-title">
          <div className="portal-form-step">
            <span className="portal-form-step-icon">
              <Building2 className="h-4 w-4" />
            </span>
            <span>Healthcare professionals</span>
            <span className="portal-form-step-count">Secure access</span>
          </div>

          <div className="portal-form-heading">
            <h1 id="clinician-login-title">Welcome back</h1>
            <p>Sign in to review patient sessions and screening summaries.</p>
          </div>

          {errorMsg && (
            <div className="portal-error-alert" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <strong>Sign-in error</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="portal-login-form">
            <div className="portal-field">
              <label htmlFor="clinician-email">Hospital staff email</label>
              <div className="portal-input-wrap">
                <Mail className="portal-input-icon" />
                <input
                  id="clinician-email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="name@hospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="portal-input"
                />
              </div>
            </div>

            <div className="portal-field">
              <div className="portal-label-row">
                <label htmlFor="clinician-password">Password</label>
                <Link to="/auth/forgot-password">Forgot password?</Link>
              </div>
              <div className="portal-input-wrap">
                <LockKeyhole className="portal-input-icon" />
                <input
                  id="clinician-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="portal-input"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="portal-submit-button">
              <span>{isLoading ? 'Authenticating clinician…' : 'Sign in to clinical portal'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="portal-secure-note">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Role-based access control · Activity is audit logged
          </div>
        </section>
      </main>

      <footer className="portal-login-footer">
        <span>NeuLens hospital neurological screening platform · Authorised staff only</span>
        <Link to="/patient">Go to patient check-in</Link>
      </footer>
    </div>
  );
};

export default DoctorLoginPage;
