import { useState, useEffect } from "react";
import { X, Calendar, MapPin, Image, Upload, Trash2 } from "lucide-react";
import { HistoryRecord, ImageData } from "./history-item";
import "../../css/auth-page.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EditRecordDialogProps {
  record: HistoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: HistoryRecord, newPhotos?: File[]) => void;
  onDeleteImage?: (recordId: string, imageId: string) => Promise<boolean>;
  onDelete?: () => void;
  carId?: string;
}

const recordTypes = [
  { value: 'maintenance', label: 'ТО', bg: 'bg-blue-500/10', text: 'text-blue-500', selected: 'bg-blue-500' },
  { value: 'repair', label: 'Ремонт', bg: 'bg-red-500/10', text: 'text-red-500', selected: 'bg-red-500' },
  { value: 'parts', label: 'Запчасти', bg: 'bg-green-500/10', text: 'text-green-600', selected: 'bg-green-500' },
  { value: 'inspection', label: 'Осмотр', bg: 'bg-orange-500/10', text: 'text-orange-600', selected: 'bg-orange-500' },
];

export function EditRecordDialog({ record, isOpen, onClose, onSave, onDeleteImage, onDelete, carId }: EditRecordDialogProps) {
  const [type, setType] = useState<HistoryRecord['type']>('maintenance');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mileage, setMileage] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState("");
  const [existingPhotos, setExistingPhotos] = useState<ImageData[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;


  const [errors, setErrors] = useState<{
    title?: boolean;
    description?: boolean;
  }>({});

  const [photoToDelete, setPhotoToDelete] = useState<{ index: number; url: string } | null>(null);

  // Блокируем скролл body когда диалог открыт
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (record) {
      setType(record.type);
      setTitle(record.title);
      setDescription(record.description);
      setMileage(record.mileage || "");
      setServiceLocation(record.serviceLocation || "");
      setDate(record.timestamp);
      setCost(record.cost || "");
      // Используем images ��сли есть, иначе создаем из photos
      setExistingPhotos(record.images || []);
      setNewPhotos([]);
      setErrors({});
    }
  }, [record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!record) return;

    const newErrors: typeof errors = {};

    if (!title.trim()) newErrors.title = true;
    if (!description.trim()) newErrors.description = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Конвертируем новые фото в URL (в реальном приложении загружали бы на сервер)
    const newPhotoUrls = newPhotos.map(file => URL.createObjectURL(file));
    const allPhotos = [...existingPhotos, ...newPhotoUrls];

    onSave({
      ...record,
      type,
      title: title.trim(),
      description: description.trim(),
      mileage: mileage.trim() || undefined,
      serviceLocation: serviceLocation.trim() || undefined,
      timestamp: date,
      time: new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      cost: cost.trim() || undefined,
      photos: allPhotos.length > 0 ? allPhotos : undefined,
    }, newPhotos);

    // Закрываем форму редактирования, переход на детальный просмотр произойдет в handleEditRecord
    onClose();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPhotos([...newPhotos, ...Array.from(e.target.files)]);
    }
  };

  const removeExistingPhoto = async (index: number) => {
    const photo = existingPhotos[index];
    if (photo && photo.id && record && onDeleteImage) {
      const success = await onDeleteImage(record.id, photo.id);
      if (success) {
        setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
      }
    }
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos(newPhotos.filter((_, i) => i !== index));
  };

  if (!isOpen || !record) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        touchAction: 'none',
        WebkitOverflowScrolling: 'auto'
      }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />

      <div
        className="relative w-full max-w-md bg-background rounded-3xl shadow-xl animate-slide-up max-h-[90vh] flex flex-col mx-4"
        style={{
          position: 'relative',
          touchAction: 'pan-y',
          overscrollBehavior: 'contain'
        }}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg">Редактировать запись</h2>
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
                  onClick={() => setType(item.value as HistoryRecord['type'])}
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
              Фото чеков
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

            {(existingPhotos.length > 0 || newPhotos.length > 0) && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {existingPhotos.map((photo, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square bg-secondary rounded-xl overflow-hidden group">
                    <img
                      src={photo.url}
                      alt={`Чек ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoToDelete({ index, url: photo.url })}
                      className="absolute top-1 right-1 p-1.5 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {newPhotos.map((photo, index) => (
                  <div key={`new-${index}`} className="relative aspect-square bg-secondary rounded-xl overflow-hidden group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Новый чек ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(index)}
                      className="absolute top-1 right-1 p-1.5 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка удаления записи */}
          {onDelete && (
            <div className="pt-4">
              <button
                type="button"
                onClick={onDelete}
                className="w-full py-3 border-2 border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-500 rounded-xl hover:bg-red-600/20 hover:border-red-600/50 transition-colors"
              >
                Удалить запись
              </button>
            </div>
          )}
        </form>

        {/* Кнопки */}
        <div className="p-4 border-t border-border space-y-2 flex-shrink-0">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            Сохранить
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

      {/* Диалог подтверждения удаления фото */}
      {photoToDelete && (
        <>
          <div
            className="absolute inset-0 bg-black/70 z-10"
            onClick={() => setPhotoToDelete(null)}
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-card rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mx-auto w-fit mb-4">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Удалить фото?</h2>
                <p className="text-muted-foreground mb-6">
                  Это действие нельзя будет отменить
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPhotoToDelete(null)}
                    className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={async () => {
                      if (photoToDelete) {
                        await removeExistingPhoto(photoToDelete.index);
                        setPhotoToDelete(null);
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}