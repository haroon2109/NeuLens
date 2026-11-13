import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CreditCard,
  KeyRound,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { patientApi } from '../../services/portalApi';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../services/language/LanguageManager';
import { DemoAccessPanel } from '../auth/DemoAccessPanel';
import { SupportedLanguage } from '../../services/language/types';
import { NeulensLogoMark } from '../../components/NeulensLogoMark';
import { NeulensWordmark } from '../../components/NeulensWordmark';
import { PortalIllustration } from '../../components/PortalIllustration';

const patientLoginSchema = z.object({
  patientId: z.string().trim().min(1, 'Please enter the Patient ID printed on your card.'),
  verification: z
    .string()
    .trim()
    .regex(/^\d{4,8}$/, 'Please enter the 4 to 8 digit PIN from your Patient ID card.'),
});

type PatientLoginFields = z.infer<typeof patientLoginSchema>;

export const PatientLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { setLanguage } = useLanguageStore();

  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PatientLoginFields>({
    resolver: zodResolver(patientLoginSchema),
    defaultValues: { patientId: '', verification: '' },
  });

  const onSubmit = async (values: PatientLoginFields) => {
    setErrorMsg('');

    try {
      const res = await patientApi.login({
        patientId: values.patientId.trim(),
        verification: values.verification.trim(),
      });

      login({ ...res.user, role: 'PATIENT' });
      if (res.user.language) {
        setLanguage(res.user.language as SupportedLanguage);
      }

      navigate('/patient/language');
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'We could not find an account with that Patient ID and PIN. Please check your card or ask clinic staff.',
      );
    }
  };

  return (
    <div className="portal-login-page">
      <header className="portal-login-header">
        <Link to="/patient" className="portal-brand" aria-label="NeuLens patient portal home">
          <NeulensLogoMark className="h-9 w-9" />
          <NeulensWordmark size="small" />
        </Link>
        <Link to="/patient" className="portal-back-link">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to welcome</span>
        </Link>
      </header>

      <main className="portal-login-main">
        <PortalIllustration variant="patient" />

        <section className="portal-login-card" aria-labelledby="patient-login-title">
          <div className="portal-form-step">
            <span className="portal-form-step-icon">
              <UserRound className="h-4 w-4" />
            </span>
            <span>Returning patient</span>
            <span className="portal-form-step-count">Step 2 of 6</span>
          </div>

          <div className="portal-form-heading">
            <h1 id="patient-login-title">Welcome back</h1>
            <p>Enter your Patient ID and check-in details to continue.</p>
          </div>

          {errorMsg && (
            <div className="portal-error-alert" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <strong>Check-in error</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <DemoAccessPanel mode="patient-id" roles={['patient']} onError={setErrorMsg} />

          <form onSubmit={handleSubmit(onSubmit)} className="portal-login-form" noValidate>
            <div className="portal-field">
              <label htmlFor="patient-id">Patient ID number</label>
              <div className="portal-input-wrap">
                <CreditCard className="portal-input-icon" />
                <input
                  id="patient-id"
                  type="text"
                  autoCapitalize="characters"
                  autoComplete="username"
                  placeholder="CV-2026-XXXXXX"
                  className="portal-input portal-input-mono"
                  aria-invalid={Boolean(errors.patientId)}
                  aria-describedby={errors.patientId ? 'patient-id-error' : undefined}
                  {...register('patientId', {
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase();
                    },
                  })}
                />
              </div>
              {errors.patientId ? (
                <span id="patient-id-error" className="auth-field-error">
                  {errors.patientId.message}
                </span>
              ) : (
                <p className="portal-field-hint">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Found on your printed hospital appointment card.
                </p>
              )}
            </div>

            <div className="portal-field">
              <label htmlFor="patient-verification">PIN</label>
              <div className="portal-input-wrap">
                <KeyRound className="portal-input-icon" />
                <input
                  id="patient-verification"
                  type="password"
                  inputMode="numeric"
                  autoComplete="current-password"
                  placeholder="Enter your PIN"
                  maxLength={8}
                  className="portal-input"
                  aria-invalid={Boolean(errors.verification)}
                  aria-describedby={errors.verification ? 'patient-verification-error' : undefined}
                  {...register('verification')}
                />
              </div>
              {errors.verification ? (
                <span id="patient-verification-error" className="auth-field-error">
                  {errors.verification.message}
                </span>
              ) : (
                <p className="portal-field-hint">
                  Use the PIN you chose during registration. Birth year and date of birth are not accepted as sign-in credentials.
                </p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="portal-submit-button">
              <span>{isSubmitting ? 'Checking your record…' : 'Continue to language selection'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="portal-login-switch">
            New to NeuLens? <Link to="/patient/register">Create a patient profile</Link>
          </p>

          <div className="portal-secure-note">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Your information is only used to support your screening session.
          </div>
        </section>
      </main>

      <footer className="portal-login-footer">
        <span>If you have lost your Patient ID, please see the hospital front desk.</span>
        <Link to="/doctor/login">Healthcare professional? Sign in here</Link>
      </footer>
    </div>
  );
};

export default PatientLoginPage;
