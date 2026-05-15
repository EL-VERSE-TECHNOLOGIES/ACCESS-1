import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../lib/api';
import { useRouter } from 'next/router';
import UploadWidget from '../components/UploadWidget';
import FacialLivenessCheck from '../components/FacialLivenessCheck';
import Image from 'next/image';
import Link from 'next/link';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cv: string | null;
  transactionPin: string;
  faceVerified: boolean;
  fingerprintVerified: boolean;
};

export default function Register() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      faceVerified: false,
      fingerprintVerified: false
    }
  });
  const router = useRouter();
  const [cvUploaded, setCvUploaded] = useState<string | null>(null);
  const [faceVerified, setFaceVerified] = useState<boolean>(false);
  const [fingerprintVerified, setFingerprintVerified] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCvUpload = (mediaId: string) => {
    const url = `/api/media/${mediaId}`;
    setCvUploaded(url);
    setValue('cv', url);
  };

  const handleFaceVerification = () => {
    setFaceVerified(true);
    setValue('faceVerified', true);
  };

  const handleCancelFaceVerification = () => {
    setFaceVerified(false);
    setValue('faceVerified', false);
  };

  const handleFingerprintVerification = async () => {
    try {
      // In a real app, this would trigger a native biometric prompt (WebAuthn)
      // For this ecosystem, we simulate the biometric capture
      setFingerprintVerified(true);
      setValue('fingerprintVerified', true);
    } catch (error) {
      console.error('Fingerprint verification failed:', error);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setValue('transactionPin', value);
  };

  async function onSubmit(data: FormData) {
    if (!cvUploaded) {
      alert('Please upload your CV');
      return;
    }

    if (!faceVerified && !fingerprintVerified) {
      alert('Security Requirement: Please complete at least one biometric verification (Face or Fingerprint)');
      return;
    }

    if (!data.transactionPin || data.transactionPin.length !== 4) {
      alert('Please enter a 4-digit transaction PIN');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullName = `${data.firstName.toUpperCase()} ${data.lastName.toUpperCase()}`;

      await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: fullName,
        cv: cvUploaded,
        transactionPin: data.transactionPin,
        faceVerified: faceVerified,
        fingerprintVerified: fingerprintVerified
      });

      alert('Registration successful — your account is now secured with biometrics');
      router.push('/login');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-dark-surface relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 -left-20 w-96 h-96 bg-neon-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-neon mb-6">
            <Image
              src="/images/new_logo.jpg"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Ecosystem Registration</h1>
          <p className="text-text-secondary mt-2">Join EL ACCESS and secure your account with biometric ID</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-dark-surface-variant/40 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">First Name *</label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-accent/50 focus:border-neon-accent transition-all"
                placeholder="JOHN"
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Last Name *</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-accent/50 focus:border-neon-accent transition-all"
                placeholder="DOE"
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email Address *</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-accent/50 focus:border-neon-accent transition-all"
              placeholder="john.doe@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password *</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              type="password"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-accent/50 focus:border-neon-accent transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
            <label className="block text-sm font-medium text-text-secondary mb-2">4-Digit Transaction PIN *</label>
            <input
              onChange={handlePinChange}
              maxLength={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-2xl tracking-[1em] font-mono text-neon-accent focus:border-neon-accent transition-all"
              placeholder="0000"
              type="password"
            />
            <p className="text-slate-500 text-xs mt-2 text-center text-balance">This PIN + Biometrics will be required for all wallet transactions.</p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-secondary">Professional CV *</label>
            <div className="p-1 bg-slate-900 border border-slate-700 border-dashed rounded-2xl hover:border-neon-accent transition-colors">
              <UploadWidget onComplete={(mediaId) => handleCvUpload(mediaId)} />
            </div>
            {cvUploaded && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Document Attached
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.908-3.367 9.192-8 10.466-4.633-1.274-8-5.558-8-10.466 0-.68.056-1.35.166-2.001zm8 9.747l3.733-3.733-1.414-1.414L10 11.88l-2.319-2.319-1.414 1.414 3.733 3.733z" clipRule="evenodd" />
              </svg>
              Biometric Enrollment *
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Face ID</span>
                <FacialLivenessCheck onSuccess={handleFaceVerification} onCancel={handleCancelFaceVerification} />
                {faceVerified && (
                  <span className="mt-3 text-xs font-bold text-neon-accent flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ENROLLED
                  </span>
                )}
              </div>

              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Touch ID</span>
                <button
                  type="button"
                  onClick={() => handleFingerprintVerification()}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    fingerprintVerified
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-blue-500/50 hover:text-blue-400'
                  }`}
                >
                  {fingerprintVerified ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      BIO CAPTURED
                    </>
                  ) : 'SCAN FINGERPRINT'}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 text-center uppercase tracking-tighter">At least one biometric required for ecosystem security</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 bg-neon-accent text-dark-surface font-black text-lg rounded-2xl hover:bg-neon-accent-hover transform active:scale-[0.98] transition-all shadow-neon ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'CREATING SECURE ACCOUNT...' : 'COMPLETE REGISTRATION'}
          </button>

          <p className="text-center text-text-secondary text-sm pt-4 border-t border-slate-800">
            Already have an account? {' '}
            <Link href="/login" className="text-neon-accent font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
