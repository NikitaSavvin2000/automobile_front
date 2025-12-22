import { X, Edit2, Trash2, Plus } from 'lucide-react';
import { Car } from './add-car-dialog';
import { CarProfileIcon } from './car-profile-icon';

interface CarSelectorModalProps {
  isOpen: boolean;
  cars: Car[];
  selectedCar: Car | null;
  onClose: () => void;
  onSelect: (car: Car) => void;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  onAdd: () => void;
}

export function CarSelectorModal({
  isOpen,
  cars,
  selectedCar,
  onClose,
  onSelect,
  onEdit,
  onDelete,
  onAdd,
}: CarSelectorModalProps) {
  if (!isOpen) return null;

  const handleSelect = (car: Car) => {
    onSelect(car);
    onClose();
  };

  const handleEdit = (e: React.MouseEvent, car: Car) => {
    e.stopPropagation();
    onEdit(car);
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, car: Car) => {
    e.stopPropagation();
    onDelete(car);
  };

  const handleAdd = () => {
    onAdd();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto">
        <div className="bg-white dark:bg-card rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-secondary flex-shrink-0">
            <h2 className="text-lg font-semibold">Мои автомобили</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 p-2">
            {cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Plus className="w-12 h-12 text-primary" />
                </div>
                <p className="text-muted-foreground text-center">
                  У вас пока нет автомобилей
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {cars.map((car) => {
                  const isSelected = selectedCar?.id === car.id;
                  return (
                    <div
                      key={car.id}
                      className={`rounded-xl transition-all relative ${
                        isSelected
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-secondary/50 border-2 border-transparent hover:border-secondary'
                      }`}
                    >
                      <button
                        onClick={() => handleSelect(car)}
                        className="w-full p-3 pr-20"
                      >
                        <div className="flex items-center gap-3">
                          {/* SVG профиль автомобиля в цвете пользователя */}
                          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                            <CarProfileIcon
                              color={car.color || '#0088CC'}
                              className="w-full h-full"
                            />
                          </div>

                          {/* Данные автомобиля */}
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-baseline gap-1.5">
                              <p className="font-semibold text-base truncate">
                                {car.brand}
                              </p>
                              <p className="font-medium text-sm text-foreground/70 truncate">
                                {car.model}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span>{car.year} год</span>
                              <span>•</span>
                              <span>{Number(car.mileage).toLocaleString()} км</span>
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Кнопки действий */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button
                          onClick={(e) => handleEdit(e, car)}
                          className="p-2 hover:bg-white dark:hover:bg-card rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit2 className="w-4 h-4 text-primary" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, car)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer - Кнопка добавить */}
          <div className="p-3 border-t border-secondary bg-secondary/20 flex-shrink-0">
            <button
              onClick={handleAdd}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Добавить автомобиль
            </button>
          </div>
        </div>
      </div>
    </>
  );
}