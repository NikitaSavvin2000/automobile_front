import { useState, useEffect } from "react";
import { X, Calendar, MapPin, FileText, Image, Upload } from "lucide-react";
import "../../css/auth-page.css";

export interface NewRecord {
  type: 'maintenance' | 'repair' | 'parts' | 'inspection';
  title: string;
  description: string;
  mileage?: string;
  serviceLocation?: string;
  date: string;
  photos?: File[];
  cost?: string;
}

interface AddRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (record: NewRecord) => void;
}

const recordTypes = [
  { value: 'maintenance', label: 'ТО', bg: 'bg-blue-500/10', text: 'text-blue-500', selected: 'bg-blue-500' },
  { value: 'repair', label: 'Ремонт', bg: 'bg-red-500/10', text: 'text-red-500', selected: 'bg-red-500' },
  { value: 'parts', label: 'Запчасти', bg: 'bg-green-500/10', text: 'text-green-600', selected: 'bg-green-500' },
  { value: 'inspection', label: 'Осмотр', bg: 'bg-orange-500/10', text: 'text-orange-600', selected: 'bg-orange-500' },
];

export function AddRecordDialog({ isOpen, onClose, onAdd }: AddRecordDialogProps) {
  const [type, setType] = useState<NewRecord['type']>('maintenance');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mileage, setMileage] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;


  const [errors, setErrors] = useState<{
    title?: boolean;
    description?: boolean;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};
    
    if (!title.trim()) newErrors.title = true;
    if (!description.trim()) newErrors.description = true;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      type,
      title: title.trim(),
      description: description.trim(),
      mileage: mileage.trim() || undefined,
      serviceLocation: serviceLocation.trim() || undefined,
      date,
      photos: photos.length > 0 ? photos : undefined,
      cost: cost.trim() || undefined,
    });

    // Сброс формы
    setType('maintenance');
    setTitle("");
    setDescription("");
    setMileage("");
    setServiceLocation("");
    setDate(new Date().toISOString().split('T')[0]);
    setCost("");
    setPhotos([]);
    setErrors({});
    onClose();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl shadow-xl animate-slide-up max-h-[90vh] flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg">Новая запись</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Тип записи */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Тип записи
            </label>
            <div className="grid grid-cols-4 gap-2">
              {recordTypes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setType(item.value as NewRecord['type'])}
                  className={`p-3 rounded-xl text-xs transition-all ${
                    type === item.value
                      ? `${item.selected} text-white shadow-md`
                      : `${item.bg} ${item.text}`
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Название */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Название <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Замена масла"
              className={`w-full px-4 py-2.5 bg-white dark:bg-card border rounded-xl outline-none focus:ring-2 transition-all duration-300 ${
                errors.title ? "border-red-400 ring-2 ring-red-400 shake" : "border-border focus:ring-primary/20"
              }`}
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Что делалось <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробное описание работ..."
              rows={3}
              className={`w-full px-4 py-2.5 bg-white dark:bg-card border rounded-xl outline-none focus:ring-2 resize-none transition-all duration-300 ${
                errors.description ? "border-red-400 ring-2 ring-red-400 shake" : "border-border focus:ring-primary/20"
              }`}
            />
          </div>

          {/* Дата */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Дата
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={
                isIOS
                  ? "w-full max-w-[90%] box-border px-4 py-2.5 bg-white dark:bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                  : "w-full box-border px-4 py-2.5 bg-white dark:bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
              }
            />
          </div>

          {/* Пробег */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Пробег (км)
            </label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="150000"
              className="w-full px-4 py-2.5 bg-white dark:bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Автосервис */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Где делалось
            </label>
            <input
              type="text"
              value={serviceLocation}
              onChange={(e) => setServiceLocation(e.target.value)}
              placeholder="Автосервис или самостоятельно"
              className="w-full px-4 py-2.5 bg-white dark:bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Стоимость */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Стоимость (₽)
            </label>
            <input
              type="text"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="5000"
              className="w-full px-4 py-2.5 bg-white dark:bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Фото чеков */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              Фото
            </label>
            <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors">
              <Upload className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary">Загрузить фото</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            
            {photos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square bg-secondary rounded-xl overflow-hidden group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Чек ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Кнопки */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            Добавить запись
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}