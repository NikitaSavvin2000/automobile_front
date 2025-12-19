import { Search, Wrench, Package } from "lucide-react";

interface ComingSoonProps {
  type: 'service' | 'parts';
}

export function ComingSoon({ type }: ComingSoonProps) {
  const config = {
    service: {
      icon: Wrench,
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600',
      title: 'Поиск автосервиса',
      description: 'Находите проверенные автосервисы рядом с вами',
      features: [
        'Рейтинги и отзывы',
        'Цены на услуги',
        'Онлайн запись',
        'Специализация мастеров'
      ]
    },
    parts: {
      icon: Package,
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-600',
      title: 'Поиск запчастей',
      description: 'Быстрый поиск оригинальных и аналоговых запчастей',
      features: [
        'Сравнение цен',
        'Наличие на складах',
        'Доставка',
        'Гарантия качества'
      ]
    }
  };

  const { icon: Icon, iconBg, iconColor, title, description, features } = config[type];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="relative mb-6">
        <div className={`w-24 h-24 ${iconBg} rounded-2xl flex items-center justify-center shadow-sm`}>
          <Icon className={`w-12 h-12 ${iconColor}`} />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-xl p-2.5 shadow-lg">
          <Search className="w-5 h-5" />
        </div>
      </div>

      <h2 className="mb-2 text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        {description}
      </p>

      <div className="bg-white dark:bg-card rounded-2xl p-6 w-full max-w-xs mb-6 shadow-sm">
        <h3 className="mb-4 text-left text-[15px]">Будет доступно:</h3>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-left">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-sm">Скоро будет</span>
      </div>
    </div>
  );
}