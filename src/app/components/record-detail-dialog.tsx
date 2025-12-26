import { X, Gauge, MapPin, Calendar, DollarSign, Edit2, Wrench, Package, ClipboardCheck, AlertCircle, Trash2 } from "lucide-react";
import { HistoryRecord } from "./history-item";
import { useState, useEffect } from "react";
import { getCarRecordInfo } from "../../api/cars-records";
import { PhotoViewer } from "./photo-viewer";

interface RecordDetailDialogProps {
  record: HistoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (record: HistoryRecord) => void;
  onDelete?: () => void;
  carId?: string;
  onDeleteImage?: (recordId: string, imageId: string) => Promise<boolean>;
}

const iconMap = {
  maintenance: Wrench,
  repair: AlertCircle,
  parts: Package,
  inspection: ClipboardCheck,
};

const iconColorMap = {
  maintenance: { bg: 'bg-blue-500/10', text: 'text-blue-500', solid: 'bg-blue-500' },
  repair: { bg: 'bg-red-500/10', text: 'text-red-500', solid: 'bg-red-500' },
  parts: { bg: 'bg-green-500/10', text: 'text-green-600', solid: 'bg-green-500' },
  inspection: { bg: 'bg-orange-500/10', text: 'text-orange-600', solid: 'bg-orange-500' },
};

const typeLabels = {
  maintenance: 'ТО',
  repair: 'Ремонт',
  parts: 'Запчасти',
  inspection: 'Осмотр',
};

export function RecordDetailDialog({ record, isOpen, onClose, onEdit, onDelete, carId, onDeleteImage }: RecordDetailDialogProps) {
  const [detailedRecord, setDetailedRecord] = useState<HistoryRecord | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [photoToDelete, setPhotoToDelete] = useState<{ index: number; imageId: string } | null>(null);

  // Загружаем детальную информацию при открытии записи
  useEffect(() => {
    if (isOpen && record && carId) {
      // Сразу устанавливаем record, чтобы не было задержки отображения
      setDetailedRecord(record);
      // Затем подгружаем актуальные данные с бэкенда
      loadRecordDetails();
    } else if (!isOpen) {
      // Сбрасываем детальную запись при закрытии
      setDetailedRecord(null);
    }
  }, [isOpen, record?.id, carId]);

  const loadRecordDetails = async () => {
    if (!record || !carId) return;

    setIsLoadingDetails(true);
    try {
      console.log('🔍 Загрузка детальной информации для записи:', record.id);
      const data = await getCarRecordInfo(carId, record.id);
      
      console.log('📡 Детальная информация получена:', data);
      
      if (data) {
        // Преобразуем данные с бэкенда в формат HistoryRecord
        const updatedRecord: HistoryRecord = {
          ...record,
          description: data.description || '',
          photos: data.images?.map((img: any) => img.url) || [],
          images: data.images?.map((img: any) => ({
            id: img.id.toString(),
            url: img.url
          })) || [],
        };
        
        console.log('✅ Обновленная запись с деталями:', updatedRecord);
        setDetailedRecord(updatedRecord);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки деталей записи:', error);
      setDetailedRecord(record);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (!isOpen || !record) return null;

  // Используем детальную запись если загружена, иначе исходную
  const displayRecord = detailedRecord || record;

  console.log('📋 RecordDetailDialog - Отображаемая запись:', displayRecord);
  console.log('📸 Фотографии:', displayRecord.photos);
  console.log('📝 Описание:', displayRecord.description);

  const Icon = iconMap[displayRecord.type];
  const colors = iconColorMap[displayRecord.type];

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!record || !onDeleteImage) return;
    
    const success = await onDeleteImage(record.id, imageId);
    if (success) {
      // Перезагружаем детальную информацию
      await loadRecordDetails();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-background rounded-3xl shadow-xl animate-slide-up max-h-[90vh] flex flex-col mx-4">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <h2 className="text-lg">{record.title}</h2>
              <p className="text-xs text-muted-foreground">{typeLabels[record.type]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Дата */}
          <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Дата</p>
                <p className="text-[15px]">{formatDate(record.timestamp)}</p>
              </div>
            </div>
          </div>

          {/* Что делалось */}
          {displayRecord.description && (
            <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm text-muted-foreground mb-2">Что делалось</h3>
              <p className="text-[15px] whitespace-pre-wrap">{displayRecord.description}</p>
            </div>
          )}

          {/* Пробег */}
          {record.mileage && (
            <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Пробег</p>
                  <p className="text-[15px]">{Number(record.mileage).toLocaleString()} км</p>
                </div>
              </div>
            </div>
          )}

          {/* Где делалось */}
          {record.serviceLocation && (
            <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Где делалось</p>
                  <p className="text-[15px]">{record.serviceLocation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Стоимость */}
          {record.cost && (
            <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Стоимость</p>
                  <p className="text-[15px]">{record.cost} ₽</p>
                </div>
              </div>
            </div>
          )}

          {/* Фотоматериалы */}
          {displayRecord.photos && displayRecord.photos.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm text-muted-foreground mb-3">Фото</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {displayRecord.photos.map((photo, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-32 h-32 bg-secondary rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setSelectedPhotoIndex(index);
                      setPhotoViewerOpen(true);
                    }}
                  >
                    <img
                      src={photo}
                      alt={`Чек ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => onEdit(displayRecord)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
            Редактировать
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>

      {/* Photo Viewer */}
      {photoViewerOpen && displayRecord.photos && displayRecord.photos.length > 0 && (
        <PhotoViewer
          photos={displayRecord.photos}
          images={displayRecord.images}
          initialIndex={selectedPhotoIndex}
          isOpen={photoViewerOpen}
          onClose={() => setPhotoViewerOpen(false)}
          onDeleteImage={onDeleteImage ? handleDeleteImage : undefined}
        />
      )}
    </div>
  );
}