import { Car, ChevronDown, Check } from "lucide-react";
import type { Car as CarType } from "./add-car-dialog";

interface CarSelectorProps {
  cars: CarType[];
  selectedCar: CarType;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (car: CarType) => void;
}

export function CarSelector({ cars, selectedCar, isOpen, onToggle, onSelect }: CarSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onToggle} />
      <div className="relative bg-background rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 duration-300">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4">
          <h2>Выберите автомобиль</h2>
        </div>

        <div className="p-2">
          {cars.map((car) => {
            const isSelected = car.id === selectedCar.id;
            return (
              <button
                key={car.id}
                onClick={() => {
                  onSelect(car);
                  onToggle();
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-secondary rounded-lg transition-colors"
              >
                <div className="bg-primary/10 rounded-full p-3">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-foreground">{car.brand} {car.model}</h3>
                  <p className="text-sm text-muted-foreground">{car.year} • {car.mileage} км</p>
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface CarHeaderProps {
  car: CarType;
  onOpenSelector: () => void;
}

export function CarHeader({ car, onOpenSelector }: CarHeaderProps) {
  return (
    <button
      onClick={onOpenSelector}
      className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 -ml-2 transition-colors"
    >
      <div className="text-left">
        <h1 className="text-base">{car.brand} {car.model}</h1>
        <p className="text-xs opacity-80">{car.year}</p>
      </div>
      <ChevronDown className="w-4 h-4 opacity-60" />
    </button>
  );
}
