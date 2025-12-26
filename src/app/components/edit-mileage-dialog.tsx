import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../../css/auth-page.css";

interface EditMileageDialogProps {
  isOpen: boolean;
  currentMileage: string;
  onClose: () => void;
  onSave: (mileage: string) => void;
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

export function EditMileageDialog({ isOpen, currentMileage, onClose, onSave }: EditMileageDialogProps) {
  const [mileage, setMileage] = useState(currentMileage);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMileage(currentMileage);
      setError(false);
    }
  }, [isOpen, currentMileage]);

  const mileageInputProps = useShakeInput(
    mileage,
    setMileage,
    error,
    () => setError(false)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mileage.trim()) {
      setError(true);
      return;
    }
    onSave(mileage);
    onClose();
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
            <label htmlFor="mileage" className="block text-sm font-medium">
              Пробег (км) *
            </label>
            <input
              id="mileage"
              type="text"
              placeholder="50000"
              autoComplete="off"
              autoFocus
              {...mileageInputProps}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-secondary text-foreground rounded-xl hover:bg-muted transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}