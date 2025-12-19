import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface EditMileageDialogProps {
  isOpen: boolean;
  currentMileage: string;
  onClose: () => void;
  onSave: (mileage: string) => void;
}

export function EditMileageDialog({ isOpen, currentMileage, onClose, onSave }: EditMileageDialogProps) {
  const [mileage, setMileage] = useState(currentMileage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mileage) {
      onSave(mileage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-t-3xl sm:rounded-3xl w-full max-w-md animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 duration-300">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2>Изменить пробег</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mileage">Пробег (км)</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="50000"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              required
              autoFocus
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
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
