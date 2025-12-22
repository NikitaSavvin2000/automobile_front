import { 
  User, 
  Bell, 
  Lock, 
  Database, 
  Palette, 
  Globe, 
  Info, 
  ChevronRight,
  Camera,
  LogOut,
  Mail,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { useTheme } from "../context/theme-context";
import { useState } from "react";

interface SettingsProps {
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  onLogout?: () => void;
}

interface SettingsSectionProps {
  children: React.ReactNode;
  className?: string;
}

interface SettingsItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  danger?: boolean;
}

function SettingsSection({ children, className = "" }: SettingsSectionProps) {
  return (
    <div className={`bg-white dark:bg-card rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SettingsItem({ icon, iconBg, iconColor, title, subtitle, onClick, danger }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors border-b border-border last:border-b-0 ${
        danger ? 'text-destructive' : 'text-foreground'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`text-[15px] ${danger ? 'text-destructive' : ''}`}>{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {!danger && <ChevronRight className="w-5 h-5 text-muted-foreground/40" />}
    </button>
  );
}

interface ThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function ThemeDialog({ isOpen, onClose }: ThemeDialogProps) {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, label: 'Светлая', icon: Sun, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-600' },
    { value: 'dark' as const, label: 'Темная', icon: Moon, iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-600' },
    { value: 'system' as const, label: 'Системная', icon: Monitor, iconBg: 'bg-gray-500/10', iconColor: 'text-gray-600' },
  ];

  const handleThemeSelect = (value: typeof theme) => {
    setTheme(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl shadow-xl animate-slide-up">
        <div className="p-6">
          <h3 className="text-lg mb-4">Выберите тему</h3>
          <div className="space-y-2">
            {themes.map((item) => {
              const Icon = item.icon;
              const isSelected = theme === item.value;
              
              return (
                <button
                  key={item.value}
                  onClick={() => handleThemeSelect(item.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                    isSelected 
                      ? 'bg-primary/10 ring-2 ring-primary/20' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-[15px] ${isSelected ? 'text-primary' : ''}`}>
                      {item.label}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export function Settings({ 
  userName = "Иван Иванов", 
  userPhone = "+7 999 123-45-67",
  userEmail = "ivan@example.com",
  onLogout
}: SettingsProps) {
  const { theme } = useTheme();
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Светлая';
      case 'dark': return 'Темная';
      case 'system': return 'Системная';
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-2 bg-secondary/30">
        {/* Профиль */}
        <div className="px-4 pt-8 pb-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl mb-1">{userName}</h2>
            <p className="text-sm text-muted-foreground mb-1">{userPhone}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>

        {/* Настройки */}
        <div className="px-4 space-y-3">
          <SettingsSection>
            <SettingsItem
              icon={<User className="w-[18px] h-[18px]" />}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
              title="Профиль"
              subtitle="Изменить имя и фото"
              onClick={() => console.log('Профиль')}
            />
            <SettingsItem
              icon={<Bell className="w-[18px] h-[18px]" />}
              iconBg="bg-red-500/10"
              iconColor="text-red-500"
              title="Уведомления"
              subtitle="Настройки уведомлений"
              onClick={() => console.log('Уведомления')}
            />
            <SettingsItem
              icon={<Lock className="w-[18px] h-[18px]" />}
              iconBg="bg-yellow-500/10"
              iconColor="text-yellow-600"
              title="Конфиденциальность"
              subtitle="Безопасность и данные"
              onClick={() => console.log('Конфиденциальность')}
            />
          </SettingsSection>

          <SettingsSection>
            <SettingsItem
              icon={<Database className="w-[18px] h-[18px]" />}
              iconBg="bg-green-500/10"
              iconColor="text-green-600"
              title="Данные и хранилище"
              subtitle="Использование памяти"
              onClick={() => console.log('Данные')}
            />
            <SettingsItem
              icon={<Palette className="w-[18px] h-[18px]" />}
              iconBg="bg-purple-500/10"
              iconColor="text-purple-600"
              title="Внешний вид"
              subtitle={getThemeLabel()}
              onClick={() => setIsThemeDialogOpen(true)}
            />
            <SettingsItem
              icon={<Globe className="w-[18px] h-[18px]" />}
              iconBg="bg-cyan-500/10"
              iconColor="text-cyan-600"
              title="Язык"
              subtitle="Русский"
              onClick={() => console.log('Язык')}
            />
          </SettingsSection>

          <SettingsSection>
            <SettingsItem
              icon={<Info className="w-[18px] h-[18px]" />}
              iconBg="bg-gray-500/10"
              iconColor="text-gray-600"
              title="О приложении"
              subtitle="Версия 1.0.0"
              onClick={() => console.log('О приложении')}
            />
          </SettingsSection>

          <SettingsSection className="mb-4">
            <SettingsItem
              icon={<LogOut className="w-[18px] h-[18px]" />}
              iconBg="bg-red-500/10"
              iconColor="text-red-600"
              title="Выйти"
              onClick={onLogout}
              danger
            />
          </SettingsSection>
        </div>
      </div>

      <ThemeDialog 
        isOpen={isThemeDialogOpen} 
        onClose={() => setIsThemeDialogOpen(false)} 
      />
    </>
  );
}