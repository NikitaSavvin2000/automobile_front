import { ChevronDown, Edit2, Plus } from 'lucide-react';
import { Car } from './add-car-dialog';
import { CarProfileIcon } from './car-profile-icon';

interface CarManagementHeaderProps {
  selectedCar: Car | null;
  isScrolled: boolean;
  onOpenCarSelector: () => void;
  onOpenAddCar: () => void;
  onOpenEditCar: () => void;
  onOpenEditMileage: () => void;
}

export function CarManagementHeader({
  selectedCar,
  isScrolled,
  onOpenCarSelector,
  onOpenAddCar,
  onOpenEditCar,
  onOpenEditMileage,
}: CarManagementHeaderProps) {
  if (!selectedCar) {
    return (
      <div className="p-4 pb-2">
        <div className="bg-white dark:bg-card rounded-3xl shadow-sm p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-primary/10 rounded-full p-5 mb-5">
              <Plus className="w-14 h-14 text-primary" />
            </div>
            <h2 className="text-xl mb-3 font-semibold">Добавьте свой автомобиль</h2>
            <p className="text-sm text-muted-foreground text-center mb-6 px-4">
              Начните вести историю обслуживания
            </p>
            <button
              onClick={onOpenAddCar}
              className="px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2.5 font-medium"
            >
              <Plus className="w-5 h-5" />
              Добавить автомобиль
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Основная карточка */}
      <div className="bg-white dark:bg-card rounded-[24px] shadow-sm overflow-hidden">
        
        {/* Подблок 1: Профиль автомобиля */}
        <button
          onClick={onOpenCarSelector}
          className="w-full px-5 py-3 hover:bg-secondary/20 active:bg-secondary/30 transition-all active:scale-[0.995]"
        >
          <div className="flex flex-col items-center">
            {/* Верх: Крупный силуэт автомобиля - уменьшен на 20%, без отступов */}
            <div className="w-full flex justify-center">
              <div className="w-3/5 aspect-[1.2/1] max-w-[220px]">
                <CarProfileIcon color={selectedCar.color || '#0088CC'} />
              </div>
            </div>

            {/* Низ: Данные автомобиля - по центру */}
            <div className="w-full text-center">
              <div className="relative flex items-center justify-center mb-0.5">
                <h2 className="text-3xl font-semibold tracking-tight">
                  {selectedCar.brand} {selectedCar.model}
                </h2>
                {/* Значок в absolute, чтобы не смещал текст */}
                <div className="absolute right-0 w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center">
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {selectedCar.year} год
              </p>
            </div>
          </div>
        </button>

        {/* Разделитель */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mx-5" />

        {/* Подблок 2: Пробег */}
        <div className="px-5 py-3 relative">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground/70 mb-1.5 uppercase tracking-widest font-semibold">
              Пробег
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold tracking-tight">
                {Number(selectedCar.mileage).toLocaleString()}
              </p>
              <span className="text-base text-muted-foreground/70 font-medium">км</span>
            </div>
          </div>
          
          {/* Кнопка редактирования - только иконка */}
          <button
            onClick={onOpenEditMileage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary/10 hover:bg-primary/15 active:bg-primary/20 rounded-full transition-all active:scale-95"
            title="Изменить пробег"
          >
            <Edit2 className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}