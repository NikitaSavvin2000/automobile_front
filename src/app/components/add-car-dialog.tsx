import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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

export function AddCarDialog({ isOpen, onClose, onAdd }: AddCarDialogProps) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand.trim() || !model.trim() || !year.trim() || !mileage.trim()) {
      return;
    }

    onAdd({
      brand: brand.trim(),
      model: model.trim(),
      year: year.trim(),
      mileage: mileage.trim(),
      color: color.trim() || undefined,
    });

    // Сброс формы
    setBrand("");
    setModel("");
    setYear("");
    setMileage("");
    setColor("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 duration-300">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2>Добавить автомобиль</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Марка *</Label>
            <Input
              id="brand"
              placeholder="Toyota"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Модель *</Label>
            <Input
              id="model"
              placeholder="Camry"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Год выпуска *</Label>
            <Input
              id="year"
              type="number"
              placeholder="2020"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">Пробег (км)</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="50000"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Цвет</Label>
            <Input
              id="color"
              placeholder="Черный"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}