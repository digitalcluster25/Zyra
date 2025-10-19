import React, { useState } from 'react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  description?: string;
}

const initialTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Приветственное письмо',
    subject: 'Добро пожаловать в Zyra!',
    description: 'Отправляется при регистрации нового пользователя',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Добро пожаловать в Zyra!</h1>
    </div>
    <div class="content">
      <h2>Привет, {{userName}}!</h2>
      <p>Мы рады видеть вас в нашей системе мониторинга состояния спортсменов.</p>
      <p>Для завершения регистрации подтвердите ваш email:</p>
      <center>
        <a href="{{confirmLink}}" class="button">Подтвердить Email</a>
      </center>
      <p>Или скопируйте эту ссылку в браузер:</p>
      <p style="word-break: break-all; color: #4F46E5;">{{confirmLink}}</p>
      <p>Если вы не регистрировались в Zyra, просто проигнорируйте это письмо.</p>
    </div>
    <div class="footer">
      <p>© 2025 Zyra. Система мониторинга спортсменов.</p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'password-reset',
    name: 'Сброс пароля',
    subject: 'Сброс пароля Zyra',
    description: 'Отправляется при запросе сброса пароля',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #EF4444; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    .warning { background: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Сброс пароля</h1>
    </div>
    <div class="content">
      <h2>Привет, {{userName}}!</h2>
      <p>Вы запросили сброс пароля для вашего аккаунта в Zyra.</p>
      <p>Нажмите кнопку ниже, чтобы установить новый пароль:</p>
      <center>
        <a href="{{resetLink}}" class="button">Установить новый пароль</a>
      </center>
      <p>Или скопируйте эту ссылку в браузер:</p>
      <p style="word-break: break-all; color: #EF4444;">{{resetLink}}</p>
      <div class="warning">
        <strong>⚠️ Важно:</strong> Если вы не запрашивали сброс пароля, проигнорируйте это письмо. Ваш пароль останется без изменений.
      </div>
      <p style="color: #666; font-size: 14px;">Ссылка действительна в течение 1 часа.</p>
    </div>
    <div class="footer">
      <p>© 2025 Zyra. Система мониторинга спортсменов.</p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'email-confirmed',
    name: 'Email подтвержден',
    subject: 'Ваш email подтвержден в Zyra!',
    description: 'Отправляется после подтверждения email',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #22C55E; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #22C55E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    .success { background: #F0FDF4; border-left: 4px solid #22C55E; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Email подтвержден!</h1>
    </div>
    <div class="content">
      <h2>Поздравляем, {{userName}}!</h2>
      <div class="success">
        <strong>✅ Успешно!</strong> Ваш email подтвержден и аккаунт активирован.
      </div>
      <p>Теперь вы можете пользоваться всеми функциями Zyra:</p>
      <ul>
        <li>📊 Мониторинг состояния</li>
        <li>📈 Аналитика тренировок</li>
        <li>🎯 Персональные рекомендации</li>
        <li>📱 Синхронизация на всех устройствах</li>
      </ul>
      <center>
        <a href="{{dashboardLink}}" class="button">Перейти на дашборд</a>
      </center>
    </div>
    <div class="footer">
      <p>© 2025 Zyra. Система мониторинга спортсменов.</p>
    </div>
  </div>
</body>
</html>`,
  },
];

export const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [editedSubject, setEditedSubject] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testEmailStatus, setTestEmailStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  React.useEffect(() => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      setEditedSubject(template.subject);
      setEditedContent(template.htmlContent);
    }
  }, [selectedTemplateId, templates]);

  const handleSaveTemplate = () => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplateId ? { ...t, subject: editedSubject, htmlContent: editedContent } : t
      )
    );
    alert('✅ Шаблон сохранен!');
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      setTestEmailStatus('❌ Введите email для отправки');
      return;
    }

    setTestEmailStatus('📤 Отправка...');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTestEmailStatus('✅ Тестовое письмо отправлено!');
      setTimeout(() => setTestEmailStatus(''), 3000);
    } catch (error) {
      setTestEmailStatus('❌ Ошибка при отправке');
    }
  };

  const getPreviewContent = () => {
    let content = editedContent;
    // Replace variables with dummy data
    content = content.replace(/\{\{userName\}\}/g, 'Тестовый Пользователь');
    content = content.replace(/\{\{confirmLink\}\}/g, 'http://localhost:3002/auth/confirm?token=test_token');
    content = content.replace(/\{\{resetLink\}\}/g, 'http://localhost:3002/set-password?token=test_token');
    content = content.replace(/\{\{dashboardLink\}\}/g, 'http://localhost:3002/dashboard');
    return content;
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Email Шаблоны</h1>
        <p style={{ color: '#64748B' }}>
          Управление шаблонами писем для системы. Используйте переменные: {'{{userName}}, {{confirmLink}}, {{resetLink}}, {{dashboardLink}}'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1E293B' }}>
            Шаблоны
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedTemplateId === template.id ? '#F1F5F9' : 'transparent',
                  color: selectedTemplateId === template.id ? '#1E293B' : '#475569',
                  fontWeight: selectedTemplateId === template.id ? '600' : 'normal',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedTemplateId !== template.id) {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTemplateId !== template.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 'inherit' }}>{template.name}</div>
                {template.description && (
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                    {template.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          {selectedTemplate && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="subject"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#475569',
                    marginBottom: '0.5rem',
                  }}
                >
                  Тема письма
                </label>
                <input
                  id="subject"
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => setActiveTab('preview')}
                  style={{
                    padding: '0.75rem 1.25rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    borderBottom: activeTab === 'preview' ? '2px solid #4F46E5' : '2px solid transparent',
                    color: activeTab === 'preview' ? '#4F46E5' : '#64748B',
                    fontWeight: activeTab === 'preview' ? '600' : 'normal',
                  }}
                >
                  Предпросмотр
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  style={{
                    padding: '0.75rem 1.25rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    borderBottom: activeTab === 'code' ? '2px solid #4F46E5' : '2px solid transparent',
                    color: activeTab === 'code' ? '#4F46E5' : '#64748B',
                    fontWeight: activeTab === 'code' ? '600' : 'normal',
                  }}
                >
                  HTML Код
                </button>
              </div>

              {/* Content */}
              {activeTab === 'code' ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '500px',
                      padding: '1rem',
                      border: '1px solid #CBD5E1',
                      borderRadius: '0.5rem',
                      fontFamily: 'Monaco, Menlo, monospace',
                      fontSize: '0.8125rem',
                      lineHeight: '1.5',
                      resize: 'vertical',
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    border: '1px solid #CBD5E1',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    minHeight: '500px',
                    backgroundColor: '#FFFFFF',
                    overflow: 'auto',
                    marginBottom: '1.5rem',
                  }}
                  dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                />
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <button
                  onClick={handleSaveTemplate}
                  style={{
                    backgroundColor: '#22C55E',
                    color: 'white',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Сохранить изменения
                </button>
                <button
                  onClick={() => {
                    const template = templates.find((t) => t.id === selectedTemplateId);
                    if (template) {
                      setEditedSubject(template.subject);
                      setEditedContent(template.htmlContent);
                    }
                  }}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #CBD5E1',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Сбросить
                </button>
              </div>

              {/* Test Email */}
              <div
                style={{
                  borderTop: '1px solid #E2E8F0',
                  paddingTop: '1.5rem',
                  backgroundColor: '#F8FAFC',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                }}
              >
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1E293B' }}>
                  Тестовая отправка
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <input
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    style={{
                      flexGrow: 1,
                      padding: '0.625rem 0.875rem',
                      border: '1px solid #CBD5E1',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                  />
                  <button
                    onClick={handleSendTestEmail}
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      padding: '0.625rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Отправить тест
                  </button>
                </div>
                {testEmailStatus && (
                  <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.75rem' }}>{testEmailStatus}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


