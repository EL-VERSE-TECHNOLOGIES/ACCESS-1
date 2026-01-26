import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ErrorPage({ statusCode }: { statusCode: number }) {
  const router = useRouter();

  useEffect(() => {
    // Log error to an error reporting service
    console.error(`Error ${statusCode} occurred`);
  }, [statusCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">:(</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {statusCode === 404 ? 'Page Not Found' : 'An Error Occurred'}
        </h1>
        <p className="text-gray-600 mb-6">
          {statusCode === 404
            ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
            : 'An unexpected error has occurred. Our team has been notified.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps({ res, err }: any) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return {
    props: { statusCode },
  };
}