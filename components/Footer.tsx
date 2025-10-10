import React from 'react';

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
              <button
                onClick={() => onNavigate('TERMS')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Публичная оферта
              </button>
              <button
                onClick={() => onNavigate('CONTACT')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Контакты
              </button>
              <button
                onClick={() => onNavigate('LOGIN')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Вход
              </button>
            </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

