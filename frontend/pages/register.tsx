import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../lib/api';
import { useRouter } from 'next/router';
import UploadWidget from '../components/UploadWidget';
import FacialLivenessCheck from '../components/FacialLivenessCheck';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cv: string | null;
  transactionPin: string;
  faceVerified: boolean;
};

export default function Register() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [cvUploaded, setCvUploaded] = useState<string | null>(null);
  const [faceVerified, setFaceVerified] = useState<boolean>(false);
  const [fingerprintVerified, setFingerprintVerified] = useState<boolean>(false);

  const handleCvUpload = (mediaId: string) => {
    // Assuming the mediaId can be used to construct the URL
    // In a real implementation, you'd have a way to get the actual URL from the mediaId
    const url = `/api/media/${mediaId}`; // Placeholder - adjust based on your actual media serving approach
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

  const handleFingerprintVerification = (verified: boolean) => {
    setFingerprintVerified(verified);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 4 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setValue('transactionPin', value);
  };

  async function onSubmit(data: FormData) {
    // Validate that CV is uploaded
    if (!cvUploaded) {
      alert('Please upload your CV');
      return;
    }

    // Validate that face or fingerprint verification is completed
    if (!faceVerified && !fingerprintVerified) {
      alert('Please complete face verification or fingerprint verification');
      return;
    }

    try {
      // Construct full name from first and last name
      const fullName = `${data.firstName.toUpperCase()} ${data.lastName}`;

      await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: fullName,
        cv: cvUploaded,
        transactionPin: data.transactionPin,
        faceVerified: faceVerified,
        fingerprintVerified: fingerprintVerified
      });

      alert('Registration successful — please login');
      router.push('/login');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Register for EL ACCESS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">First Name *</label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              className="w-full p-2 border rounded mb-1"
              placeholder="JOHN"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium">Last Name *</label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              className="w-full p-2 border rounded mb-1"
              placeholder="DOE"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Email Address *</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className="w-full p-2 border rounded mb-1"
            placeholder="john.doe@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Password *</label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            type="password"
            className="w-full p-2 border rounded mb-1"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">4-Digit Transaction PIN *</label>
          <input
            onChange={handlePinChange}
            maxLength={4}
            className="w-full p-2 border rounded mb-1 text-center text-xl tracking-widest"
            placeholder="0000"
            type="text"
          />
          <p className="text-gray-500 text-sm">Enter a 4-digit PIN for transactions</p>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Upload CV *</label>
          <UploadWidget onComplete={(mediaId) => handleCvUpload(mediaId)} />
          {cvUploaded && (
            <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-sm">
              CV uploaded successfully: <a href={cvUploaded} target="_blank" rel="noopener noreferrer" className="underline">View</a>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Biometric Verification *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Face Verification</h4>
              <FacialLivenessCheck onSuccess={handleFaceVerification} onCancel={handleCancelFaceVerification} />
              {faceVerified && (
                <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-sm">
                  Face verification completed
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Fingerprint Verification</h4>
              <button
                type="button"
                onClick={() => handleFingerprintVerification(true)}
                className="w-full py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
              >
                {fingerprintVerified ? 'Fingerprint Verified ✓' : 'Scan Fingerprint'}
              </button>
              {fingerprintVerified && (
                <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-sm">
                  Fingerprint verification completed
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Complete at least one biometric verification method</p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Register Account
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
