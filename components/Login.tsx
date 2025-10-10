import React from 'react';
import { LoginForm } from './LoginForm';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

