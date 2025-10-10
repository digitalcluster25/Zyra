import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const EditableField: React.FC<{
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  inputType?: string;
}> = ({ label, value, onSave, inputType = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            Редактировать
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Отмена
            </Button>
          </div>
        )}
      </div>
      {isEditing ? (
        <Input
          type={inputType}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          autoFocus
        />
      ) : (
        <p className="text-lg text-slate-900">{value}</p>
      )}
    </div>
  );
};

const Profile: React.FC = () => {
  const [nickname, setNickname] = useLocalStorage('userNickname', 'чемпион');
  const [email, setEmail] = useLocalStorage('userEmail', 'alex@example.com');

  const handleDeleteAccount = () => {
    if (window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо и сотрет все ваши данные.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EditableField
            label="Никнейм"
            value={nickname}
            onSave={setNickname}
          />
          <EditableField
            label="Email"
            value={email}
            onSave={setEmail}
            inputType="email"
          />
        </CardContent>
      </Card>
      
      <Card className="border-t-4 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Опасная зона</CardTitle>
          <CardDescription>
            Это действие нельзя будет отменить. Все ваши данные чекинов будут навсегда удалены.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleDeleteAccount}
            variant="destructive"
            className="w-full"
          >
            Удалить аккаунт
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;