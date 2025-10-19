import React from 'react';
import { Button } from './ui/button';

interface FooterProps {
  onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 mt-16">
      <div className="container mx-auto p-4 md:p-8 max-w-[1382px]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © 2025 ZYRA. Все права защищены.
          </div>
            <nav className="flex gap-6 text-sm">
              <Button
                variant="link"
                onClick={() => onNavigate('AUTH')}
                className="text-muted-foreground hover:text-foreground p-0 h-auto"
              >
                Авторизация
              </Button>
              <Button
                variant="link"
                onClick={() => onNavigate('SET_PASSWORD')}
                className="text-muted-foreground hover:text-foreground p-0 h-auto"
              >
                Установка пароля
              </Button>
              <Button
                variant="link"
                onClick={() => onNavigate('TERMS')}
                className="text-muted-foreground hover:text-foreground p-0 h-auto"
              >
                Публичная оферта
              </Button>
              <Button
                variant="link"
                onClick={() => onNavigate('CONTACT')}
                className="text-muted-foreground hover:text-foreground p-0 h-auto"
              >
                Контакты
              </Button>
            </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

