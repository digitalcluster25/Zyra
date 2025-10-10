import React, { useState } from 'react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Здесь будет логика авторизации
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Добро пожаловать в ZYRA</h1>
        <p className="text-sm text-slate-500">
          Войдите в свой аккаунт для доступа к данным
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ваш@email.com"
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Войти
        </button>
      </form>

      <div className="text-center text-sm text-slate-500">
        <p>
          Нет аккаунта?{' '}
          <button className="text-emerald-600 hover:text-emerald-700 font-medium">
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  );
};

