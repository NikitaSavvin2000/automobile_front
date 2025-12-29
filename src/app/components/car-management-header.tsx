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
        <div className="bg-white dark:bg-card rounded-3xl shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-5">
            <div className="bg-primary/10 rounded-full p-3 mb-3">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-lg mb-2 font-semibold">Добавьте свой автомобиль</h2>
            <p className="text-xs text-muted-foreground text-center mb-4 px-4">
              Начните вести историю обслуживания
            </p>
            <button
              onClick={onOpenAddCar}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
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
      <div className="bg-white dark:bg-card rounded-[14px] shadow-sm overflow-hidden">

        {/* Подблок 1: Профиль автомобиля */}
        <button
          onClick={onOpenCarSelector}
          className="w-full px-1 hover:bg-secondary/10 active:bg-secondary/10 transition-all active:scale-[0.895]"
        >
          <div className="flex flex-col items-center">
            {/* Верх: Крупный силуэт автомобиля - уменьшен на 30% */}
              <div className="mt-[14px] w-3/4 aspect-[1/0.15] max-w-[920px]">
                <CarProfileIcon color={selectedCar.color || '#0088CC'} className="w-full h-auto"/>
            </div>

            {/* Низ: Данные автомобиля - по центру */}
            <div className="w-full text-center">
              <div className="relative flex items-center justify-center mb-0.5">
                <h2 className="text-[25px] font-semibold tracking-tight">
                  {selectedCar.brand} {selectedCar.model}
                </h2>
                {/* Значок в absolute, чтобы не смещал текст */}
                <div className="absolute right-0 w-5 h-5 rounded-full bg-secondary/50 flex items-center justify-center">
                  <ChevronDown className="w-3 h-3 text-muted-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {selectedCar.year} год
              </p>
            </div>
          </div>
        </button>

        {/* Разделитель */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mx-4" />

        {/* Подблок 2: Пробег */}
        <div className="px-4 py-2 relative">
          <p className="text-[9px] text-muted-foreground/70 mb-1 uppercase tracking-widest font-semibold text-center">
            Пробег
          </p>
          <div className="relative w-full">
            <span className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-tight">
              {Number(selectedCar.mileage).toLocaleString()}
            </span>
            <span className="absolute left-1/2 text-sm text-muted-foreground/70 font-medium" style={{ transform: `translateX(${Number(selectedCar.mileage).toLocaleString().length * 7.5}px)` }}>
              км
            </span>
            {/* Invisible placeholder для высоты */}
            <div className="invisible text-2xl font-bold">0</div>
          </div>

          {/* Кнопка редактирования - только иконка */}
          <button
            onClick={onOpenEditMileage}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 hover:bg-primary/15 active:bg-primary/20 rounded-full transition-all active:scale-95"
            title="Изменить пробег"
          >
            <Edit2 className="w-4 h-4 text-primary" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}