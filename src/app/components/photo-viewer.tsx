import { X, Download, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { ImageData } from "./history-item";

interface PhotoViewerProps {
  photos: string[];
  images?: ImageData[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onDeleteImage?: (imageId: string) => Promise<void>;
}

export function PhotoViewer({ photos, images, initialIndex, isOpen, onClose, onDeleteImage }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];
  const currentImage = images?.[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentPhoto);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photo-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании фото:', error);
    }
  };

  const handleDelete = async () => {
    if (currentImage?.id && onDeleteImage) {
      setDeleteConfirmOpen(false);
      await onDeleteImage(currentImage.id);
      // Если это было последнее фото, закрываем просмотр
      if (photos.length === 1) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Верхняя панель */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <div className="text-white">
          <p className="text-sm">Фото {currentIndex + 1} из {photos.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="p-3 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <Download className="w-6 h-6" />
          </button>
          {onDeleteImage && currentImage?.id && (
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="p-3 hover:bg-red-500/20 rounded-full transition-colors text-red-400"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Основное изображение */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        <img
          src={currentPhoto}
          alt={`Фото ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />

        {/* Навигация между фото */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Превью фотографий внизу */}
      {photos.length > 1 && (
        <div className="p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-primary scale-110'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={photo}
                  alt={`Превью ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Подтверждение удаления в стиле iOS/Telegram */}
      {deleteConfirmOpen && (
        <>
          <div
            className="fixed inset-0 z-[101] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setDeleteConfirmOpen(false)}
          />
          <div className="fixed inset-0 z-[102] flex items-end justify-center p-4">
            <div className="w-full max-w-md animate-slide-up">
              {/* Главное меню действий */}
              <div className="bg-white dark:bg-card rounded-2xl overflow-hidden mb-2">
                <div className="p-4 text-center border-b border-border">
                  <p className="text-[13px] text-muted-foreground">
                    Это действие нельзя будет отменить
                  </p>
                </div>
                <button
                  onClick={handleDelete}
                  className="w-full py-4 text-[17px] border-2 border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-500 hover:bg-red-600/20 hover:border-red-600/50 transition-colors"
                >
                  Удалить фото
                </button>
              </div>
              
              {/* Кнопка отмены */}
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="w-full py-4 bg-white dark:bg-card rounded-2xl text-[17px] text-primary hover:bg-secondary transition-colors active:bg-secondary/80"
              >
                Отмена
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}