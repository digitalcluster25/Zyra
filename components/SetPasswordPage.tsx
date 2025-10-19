import React, { useState } from 'react';
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SetPasswordPageProps {
  className?: string;
  token?: string; // Токен из URL для установки пароля
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

function SetPasswordPage({ className, token }: SetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Проверка сложности пароля
  const checkPasswordStrength = (pwd: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (pwd.length >= 8) {
      score += 1;
    } else {
      feedback.push('Минимум 8 символов');
    }

    if (/[a-z]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('Добавьте строчные буквы');
    }

    if (/[A-Z]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('Добавьте заглавные буквы');
    }

    if (/[0-9]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('Добавьте цифры');
    }

    if (/[^A-Za-z0-9]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('Добавьте специальные символы (!@#$%^&*)');
    }

    return {
      score,
      feedback: feedback.length > 0 ? feedback : ['Отличный пароль!'],
      isValid: score >= 3 && pwd.length >= 8
    };
  };

  const passwordStrength = checkPasswordStrength(password);

  const getStrengthColor = (score: number) => {
    if (score < 2) return 'bg-red-500';
    if (score < 3) return 'bg-orange-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return 'Слабый';
    if (score < 3) return 'Средний';
    if (score < 4) return 'Хороший';
    return 'Отличный';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordStrength.isValid) {
      setError('Пароль не соответствует требованиям безопасности');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Реализовать установку пароля через API
      console.log('Set password:', { token, password });
      // Имитация успешной установки пароля
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Пароль успешно установлен! Теперь вы можете войти в систему.');
    } catch (err: any) {
      setError(err.message || 'Ошибка установки пароля');
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
            Установка пароля
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Создание пароля</CardTitle>
            <CardDescription className="text-center">
              Придумайте надежный пароль для вашего аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Новый пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                
                {/* Индикатор сложности пароля */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Сложность:</span>
                      <span className={`font-medium ${
                        passwordStrength.score < 2 ? 'text-red-600' :
                        passwordStrength.score < 3 ? 'text-orange-600' :
                        passwordStrength.score < 4 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {getStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    
                    {/* Прогресс-бар сложности */}
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>

                    {/* Список требований */}
                    <ul className="text-xs text-slate-600 space-y-1">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className={`w-1 h-1 rounded-full ${
                            item === 'Отличный пароль!' ? 'bg-green-500' :
                            item.includes('Минимум') && password.length >= 8 ? 'bg-green-500' :
                            item.includes('строчные') && /[a-z]/.test(password) ? 'bg-green-500' :
                            item.includes('заглавные') && /[A-Z]/.test(password) ? 'bg-green-500' :
                            item.includes('цифры') && /[0-9]/.test(password) ? 'bg-green-500' :
                            item.includes('специальные') && /[^A-Za-z0-9]/.test(password) ? 'bg-green-500' :
                            'bg-slate-300'
                          }`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтверждение пароля</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600">Пароли не совпадают</p>
                )}
                {confirmPassword && password === confirmPassword && password.length > 0 && (
                  <p className="text-xs text-green-600">Пароли совпадают</p>
                )}
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

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={isLoading || !passwordStrength.isValid || password !== confirmPassword}
              >
                {isLoading ? 'Сохранение...' : 'Установить пароль'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-500">
          <p>После установки пароля вы сможете войти в систему</p>
        </div>
      </div>
    </div>
  );
}

export default SetPasswordPage;
