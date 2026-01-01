import { Suspense } from 'react';
import LoginClient from './LoginClient';

function LoginPageLoading() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] bg-secondary px-4 py-12">
            {/* You can add a loading skeleton here if you want */}
        </div>
    )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginClient />
    </Suspense>
  );
}
