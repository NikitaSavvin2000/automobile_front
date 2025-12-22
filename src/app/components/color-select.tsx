import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface ColorOption {
  name: string;
  hex: string;
}

interface ColorSelectProps {
  value: string;
  onChange: (color: string) => void;
  colors: ColorOption[];
}

export function ColorSelect({ value, onChange, colors }: ColorSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedColor = colors.find((c) => c.hex === value) || colors[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка выбора */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 pr-10 bg-secondary rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left flex items-center gap-3"
      >
        <div
          className="w-6 h-6 rounded-lg border-2 border-border shadow-sm flex-shrink-0"
          style={{ backgroundColor: selectedColor.hex }}
        />
        <span className="font-medium">{selectedColor.name}</span>
        <ChevronDown
          className={`ml-auto w-5 h-5 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-card rounded-xl shadow-lg border border-border overflow-hidden animate-in slide-in-from-top-2 fade-in-0 duration-200">
          <div className="max-h-64 overflow-y-auto">
            {colors.map((color) => {
              const isSelected = color.hex === value;
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => {
                    onChange(color.hex);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                    isSelected
                      ? 'bg-primary/10'
                      : 'hover:bg-secondary/50'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-lg border-2 border-border shadow-sm flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={`flex-1 text-left font-medium ${isSelected ? 'text-primary' : ''}`}>
                    {color.name}
                  </span>
                  {isSelected && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
