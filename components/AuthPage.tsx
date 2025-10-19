import React, { useState } from 'react';
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from '../src/contexts/AuthContext';

interface AuthPageProps {
  className?: string;
  onSuccess?: () => void;
}

function AuthPage({ className, onSuccess }: AuthPageProps) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await login(email, password);
      setSuccess('Успешная авторизация!');
      setTimeout(() => onSuccess?.(), 1000);
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!nickname) {
      setError('Введите никнейм');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Пароль должен быть не менее 8 символов');
      setIsLoading(false);
      return;
    }

    try {
      await register(email, password, nickname);
      setSuccess('Регистрация успешна! Вы можете пользоваться сервисом.');
      setTimeout(() => onSuccess?.(), 1000);
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // TODO: Добавить API endpoint для сброса пароля позже
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Функция сброса пароля будет доступна позже!');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Ошибка сброса пароля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">ZYRA</h1>
          <p className="mt-2 text-sm text-slate-600">
            Система мониторинга состояния спортсменов
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
            <TabsTrigger value="reset">Сброс пароля</TabsTrigger>
          </TabsList>

          {/* Таб авторизации */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">Вход в систему</CardTitle>
                <CardDescription className="text-center">
                  Введите ваши данные для входа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="athlete@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                      {success}
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Загрузка...' : 'Войти'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Таб регистрации */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">Регистрация</CardTitle>
                <CardDescription className="text-center">
                  Создайте аккаунт и начните использовать сервис
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-nickname">Никнейм</Label>
                    <Input
                      id="register-nickname"
                      type="text"
                      placeholder="Ваш никнейм"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="athlete@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Минимум 8 символов"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                    <p className="text-xs text-slate-500">
                      Пароль должен содержать минимум 8 символов
                    </p>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                      {success}
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Отправка...' : 'Зарегистрироваться'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Таб сброса пароля */}
          <TabsContent value="reset">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">Сброс пароля</CardTitle>
                <CardDescription className="text-center">
                  Введите email для получения инструкций
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="athlete@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-slate-500">
                      На этот email будет отправлено письмо со ссылкой для создания нового пароля
                    </p>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                      {success}
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Отправка...' : 'Отправить инструкции'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
