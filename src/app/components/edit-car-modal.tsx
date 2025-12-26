import { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Car, CAR_COLORS } from './add-car-dialog';
import { ColorSelect } from './color-select';
import '../../css/auth-page.css';

interface EditCarModalProps {
  isOpen: boolean;
  car: Car | null;
  onClose: () => void;
  onSave: (car: Car) => void;
  onDelete: (carId: string) => void;
}

const useShakeInput = (
  value: string,
  setValue: (v: string) => void,
  triggerError: boolean,
  resetError: () => void
) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (triggerError) {
      setShake(true);
      const timer = setTimeout(() => {
        setShake(false);
        resetError();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [triggerError, resetError]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const className = `w-full px-4 py-3 bg-secondary rounded-xl border-0 outline-none focus:ring-2 transition-all duration-300 ${
    triggerError || shake ? "ring-2 ring-red-400 shake" : "focus:ring-primary/20"
  }`;

  return { value, onChange, className };
};

export function EditCarModal({
  isOpen,
  car,
  onClose,
  onSave,
  onDelete,
}: EditCarModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    color: CAR_COLORS[0].hex,
  });

  const [errors, setErrors] = useState<{
    brand?: boolean;
    model?: boolean;
    year?: boolean;
    mileage?: boolean;
  }>({});

  // Обновляем данные формы при открытии или изменении автомобиля
  useEffect(() => {
    if (car) {
      setFormData({
        brand: String(car.brand || ''),
        model: String(car.model || ''),
        year: String(car.year || ''),
        mileage: String(car.mileage || ''),
        color: car.color || CAR_COLORS[0].hex,
      });
      setErrors({});
    }
  }, [car, isOpen]);

  const brandInputProps = useShakeInput(
    formData.brand,
    (v) => setFormData({ ...formData, brand: v }),
    errors.brand || false,
    () => setErrors((prev) => ({ ...prev, brand: false }))
  );

  const modelInputProps = useShakeInput(
    formData.model,
    (v) => setFormData({ ...formData, model: v }),
    errors.model || false,
    () => setErrors((prev) => ({ ...prev, model: false }))
  );

  const yearInputProps = useShakeInput(
    formData.year,
    (v) => setFormData({ ...formData, year: v }),
    errors.year || false,
    () => setErrors((prev) => ({ ...prev, year: false }))
  );

  const mileageInputProps = useShakeInput(
    formData.mileage,
    (v) => setFormData({ ...formData, mileage: v }),
    errors.mileage || false,
    () => setErrors((prev) => ({ ...prev, mileage: false }))
  );

  if (!isOpen || !car) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};
    
    if (!formData.brand.trim()) newErrors.brand = true;
    if (!formData.model.trim()) newErrors.model = true;
    if (!formData.year.trim()) newErrors.year = true;
    if (!formData.mileage.trim()) newErrors.mileage = true;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: car.id,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: formData.year.trim(),
      mileage: formData.mileage.trim(),
      color: formData.color,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(car.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  if (showDeleteConfirm) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200" onClick={handleClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mx-auto w-fit mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Удалить автомобиль?</h2>
              <p className="text-muted-foreground mb-6">
                {car.brand} {car.model} будет удалён безвозвратно
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200" onClick={handleClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto">
        <div className="bg-white dark:bg-card rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-secondary">
            <h2 className="text-lg font-semibold">Редактировать автомобиль</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-4rem)]">
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Марка *</label>
                <input
                  type="text"
                  placeholder="Toyota"
                  autoComplete="off"
                  {...brandInputProps}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Модель *</label>
                <input
                  type="text"
                  placeholder="Camry"
                  autoComplete="off"
                  {...modelInputProps}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Год *</label>
                <input
                  type="text"
                  placeholder="2020"
                  autoComplete="off"
                  {...yearInputProps}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Пробег (км) *</label>
                <input
                  type="text"
                  placeholder="50000"
                  autoComplete="off"
                  {...mileageInputProps}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Цвет *</label>
                <ColorSelect
                  value={formData.color}
                  onChange={(v) => setFormData({ ...formData, color: v })}
                  colors={CAR_COLORS}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-4 py-2.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Удалить автомобиль
              </button>
            </div>

            <div className="p-4 border-t border-secondary bg-secondary/30">
              <button
                type="submit"
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm font-medium"
              >
                Сохранить изменения
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}