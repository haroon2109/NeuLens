import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Hand,
  KeyRound,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { patientApi } from '../../services/portalApi';
import { useAuthStore } from '../../store/authStore';
import { NeuLensLogo } from '../../components/NeuLensLogo';
import { PortalIllustration } from '../../components/PortalIllustration';

export const PatientRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'MALE',
    language: 'en',
    handedness: 'RIGHT',
    educationYears: '12',
    pin: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setErrorMsg('Please enter a valid age between 1 and 120.');
      return;
    }

    if (!/^\d{4,8}$/.test(formData.pin)) {
      setErrorMsg('Please choose a PIN of 4 to 8 digits. You will need it to sign in.');
      return;
    }

    setIsLoading(true);

    try {
      const pinToUse = formData.pin;
      const res = await patientApi.register({
        name: formData.name.trim(),
        age: ageNum,
        gender: formData.gender,
        language: formData.language,
        educationYears: parseInt(formData.educationYears, 10) || 12,
        handedness: formData.handedness,
        pin: pinToUse
      });

      // Save session in auth store
      login({ ...res.user, role: 'PATIENT' });

      // A new account lands on its own dashboard, the same place a returning
      // patient lands after signing in. Starting the assessment stays an
      // explicit choice from there, not something registration forces.
      navigate('/patient/dashboard', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration could not be completed. Please speak with clinic staff.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="portal-login-page portal-registration-page">
      <header className="portal-login-header">
        <Link to="/patient" className="portal-brand" aria-label="NeuLens patient portal home">
          <NeuLensLogo height="h-9" />
        </Link>
        <Link to="/patient" className="portal-back-link">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to welcome</span>
        </Link>
      </header>

      <main className="portal-login-main portal-registration-main">
        <PortalIllustration variant="patient" />

        <section className="portal-login-card portal-registration-card" aria-labelledby="registration-title">
          <div className="portal-form-step">
            <span className="portal-form-step-icon">
              <UserPlus className="h-4 w-4" />
            </span>
            <span>New patient registration</span>
            <span className="portal-form-step-count">Step 2 of 6</span>
          </div>

          <div className="portal-form-heading">
            <h1 id="registration-title">Create your profile</h1>
            <p>Please fill in your basic information below. Your answers help us calibrate your activities.</p>
          </div>

          {errorMsg && (
            <div className="portal-error-alert" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <strong>Please check your information</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="portal-login-form portal-registration-form">
            <div className="portal-field">
              <label htmlFor="patient-name">Full name <span aria-hidden="true">*</span></label>
              <div className="portal-input-wrap">
                <UserRound className="portal-input-icon" />
                <input
                  id="patient-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="portal-input"
                />
              </div>
            </div>

            <div className="portal-registration-grid">
              <div className="portal-field">
                <label htmlFor="patient-age">Age in years <span aria-hidden="true">*</span></label>
                <div className="portal-input-wrap">
                  <CalendarDays className="portal-input-icon" />
                  <input
                    id="patient-age"
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 62"
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-field">
                <label htmlFor="patient-gender">Gender <span aria-hidden="true">*</span></label>
                <div className="portal-input-wrap">
                  <UserRound className="portal-input-icon" />
                  <select
                    id="patient-gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="portal-input portal-input-select"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other / Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="portal-field">
              <div className="portal-label-row">
                <label htmlFor="patient-pin">Check-in PIN *</label>
                <span className="portal-registration-field-note">For returning visits</span>
              </div>
              <div className="portal-input-wrap">
                <KeyRound className="portal-input-icon" />
                <input
                  id="patient-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="new-password"
                  maxLength={8}
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                  placeholder="Choose a 4 to 8 digit PIN"
                  className="portal-input"
                />
              </div>
              <p className="portal-field-hint">
                Choose 4 to 8 digits. This PIN is required to sign in to your portal, so keep it private.
              </p>
            </div>

            <div className="portal-registration-grid">
              <div className="portal-field">
                <label htmlFor="patient-handedness">Dominant hand</label>
                <div className="portal-input-wrap">
                  <Hand className="portal-input-icon" />
                  <select
                    id="patient-handedness"
                    value={formData.handedness}
                    onChange={(e) => setFormData({ ...formData, handedness: e.target.value })}
                    className="portal-input portal-input-select"
                  >
                    <option value="RIGHT">Right-handed</option>
                    <option value="LEFT">Left-handed</option>
                    <option value="AMBIDEXTROUS">Ambidextrous (both hands)</option>
                  </select>
                </div>
              </div>

              <div className="portal-field">
                <label htmlFor="patient-education">Education (years)</label>
                <div className="portal-input-wrap">
                  <GraduationCap className="portal-input-icon" />
                  <input
                    id="patient-education"
                    type="number"
                    min="0"
                    max="30"
                    value={formData.educationYears}
                    onChange={(e) => setFormData({ ...formData, educationYears: e.target.value })}
                    className="portal-input"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="portal-submit-button">
              <span>{isLoading ? 'Creating your profile…' : 'Create my profile'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="portal-login-switch">
            Already have a profile? <Link to="/patient/login">Sign in</Link>
          </p>

          <div className="portal-secure-note">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Your information is kept strictly confidential under hospital healthcare protocols.
          </div>
        </section>
      </main>

      <footer className="portal-login-footer">
        <span>Basic details help personalize your screening activities.</span>
        <span className="portal-registration-footer-note">
          <Sparkles className="h-3.5 w-3.5" />
          A few minutes is all it takes to get started
        </span>
      </footer>
    </div>
  );
};