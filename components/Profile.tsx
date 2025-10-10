import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-slate-600">{label}</label>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            Редактировать
          </button>
        ) : (
          <div className="flex space-x-2">
            <button onClick={handleSave} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              Сохранить
            </button>
            <button onClick={handleCancel} className="text-sm font-semibold text-slate-600 hover:text-slate-700">
              Отмена
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <input
          type={inputType}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
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
      <div className="bg-white p-6 rounded-xl border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Профиль</h2>
        <div className="space-y-6">
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
        </div>
      </div>
      
      <div className="border-t-4 border-red-200 bg-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-red-700">Опасная зона</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">Это действие нельзя будет отменить. Все ваши данные чекинов будут навсегда удалены.</p>
          <button
              onClick={handleDeleteAccount}
              className="w-full text-center font-semibold text-red-600 hover:text-white p-3 bg-red-50 hover:bg-red-600 rounded-lg transition-colors"
          >
              Удалить аккаунт
          </button>
      </div>
    </div>
  );
};

export default Profile;