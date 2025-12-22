import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ColorSelect } from "./color-select";
import "../../css/auth-page.css";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  color?: string;
}

interface AddCarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (car: Omit<Car, 'id'>) => void;
}

// Палитра популярных цветов с названиями
export const CAR_COLORS = [
  { name: 'Черный', hex: '#000000' },
  { name: 'Белый', hex: '#FFFFFF' },
  { name: 'Серебристый', hex: '#C0C0C0' },
  { name: 'Серый', hex: '#808080' },
  { name: 'Красный', hex: '#DC143C' },
  { name: 'Синий', hex: '#1E90FF' },
  { name: 'Зеленый', hex: '#228B22' },
  { name: 'Желтый', hex: '#FFD700' },
  { name: 'Оранжевый', hex: '#FF8C00' },
  { name: 'Коричневый', hex: '#8B4513' },
  { name: 'Бежевый', hex: '#D2B48C' },
  { name: 'Фиолетовый', hex: '#9370DB' },
];

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

export function AddCarDialog({ isOpen, onClose, onAdd }: AddCarDialogProps) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState(CAR_COLORS[0].hex); // По умолчанию черный

  const [errors, setErrors] = useState<{
    brand?: boolean;
    model?: boolean;
    year?: boolean;
    mileage?: boolean;
  }>({});

  const brandInputProps = useShakeInput(brand, setBrand, errors.brand || false, () =>
    setErrors((prev) => ({ ...prev, brand: false }))
  );

  const modelInputProps = useShakeInput(model, setModel, errors.model || false, () =>
    setErrors((prev) => ({ ...prev, model: false }))
  );

  const yearInputProps = useShakeInput(year, setYear, errors.year || false, () =>
    setErrors((prev) => ({ ...prev, year: false }))
  );

  const mileageInputProps = useShakeInput(mileage, setMileage, errors.mileage || false, () =>
    setErrors((prev) => ({ ...prev, mileage: false }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};
    
    if (!brand.trim()) newErrors.brand = true;
    if (!model.trim()) newErrors.model = true;
    if (!year.trim()) newErrors.year = true;
    if (!mileage.trim()) newErrors.mileage = true;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      brand: brand.trim(),
      model: model.trim(),
      year: year.trim(),
      mileage: mileage.trim(),
      color: color,
    });

    // Сброс формы
    setBrand("");
    setModel("");
    setYear("");
    setMileage("");
    setColor(CAR_COLORS[0].hex);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto">
        <div className="bg-white dark:bg-card rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-secondary flex-shrink-0">
            <h2 className="text-lg font-semibold">Добавить автомобиль</h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Марка *</label>
                <input
                  type="text"
                  placeholder="Toyota"
                  autoComplete="off"
                  required
                  {...brandInputProps}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Модель *</label>
                <input
                  type="text"
                  placeholder="Camry"
                  autoComplete="off"
                  required
                  {...modelInputProps}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Год выпуска *</label>
                <input
                  type="text"
                  placeholder="2020"
                  autoComplete="off"
                  required
                  {...yearInputProps}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Пробег (км) *</label>
                <input
                  type="text"
                  placeholder="50000"
                  autoComplete="off"
                  required
                  {...mileageInputProps}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Цвет *</label>
                <ColorSelect value={color} onChange={setColor} colors={CAR_COLORS} />
              </div>
            </div>

            <div className="p-4 border-t border-secondary bg-secondary/30">
              <button
                type="submit"
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm font-medium"
              >
                Добавить автомобиль
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}