import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || '',
  process.env.MAILJET_SECRET_KEY || ''
);

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@yourdomain.com';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Zyra Team';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3002';

interface EmailTemplateData {
  [key: string]: string;
}

/**
 * Отправка email через Mailjet
 */
export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string,
  data: EmailTemplateData = {}
) => {
  // Замена переменных в шаблоне
  let processedHtml = htmlContent;
  for (const key in data) {
    processedHtml = processedHtml.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
  }

  try {
    const request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: EMAIL_FROM,
            Name: EMAIL_FROM_NAME,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart: processedHtml,
        },
      ],
    });

    console.log('✅ Email sent successfully:', request.body);
    return request.body;
  } catch (error: any) {
    console.error('❌ Failed to send email:', error.statusCode, error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Приветственное письмо при регистрации
 */
export const sendWelcomeEmail = async (email: string, userName: string, token: string) => {
  const confirmLink = `${FRONTEND_URL}/auth/confirm?token=${token}`;
  const subject = 'Добро пожаловать в Zyra!';
  const htmlContent = `
    <!DOCTYPE html>
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
    </html>
  `;

  await sendEmail(email, subject, htmlContent, { userName, confirmLink });
};

/**
 * Письмо для сброса пароля
 */
export const sendPasswordResetEmail = async (email: string, userName: string, token: string) => {
  const resetLink = `${FRONTEND_URL}/set-password?token=${token}`;
  const subject = 'Сброс пароля Zyra';
  const htmlContent = `
    <!DOCTYPE html>
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
    </html>
  `;

  await sendEmail(email, subject, htmlContent, { userName, resetLink });
};

/**
 * Подтверждение email
 */
export const sendEmailConfirmedEmail = async (email: string, userName: string) => {
  const dashboardLink = `${FRONTEND_URL}/dashboard`;
  const subject = 'Ваш email подтвержден в Zyra!';
  const htmlContent = `
    <!DOCTYPE html>
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
    </html>
  `;

  await sendEmail(email, subject, htmlContent, { userName, dashboardLink });
};

/**
 * Тестовое письмо (для проверки настроек)
 */
export const sendTestEmail = async (to: string, subject: string, htmlContent: string) => {
  await sendEmail(to, subject, htmlContent);
};


