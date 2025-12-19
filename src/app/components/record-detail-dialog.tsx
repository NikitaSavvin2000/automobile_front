import { X, Gauge, MapPin, Calendar, DollarSign, Edit2, Wrench, Package, ClipboardCheck, AlertCircle } from "lucide-react";
import { HistoryRecord } from "./history-item";

interface RecordDetailDialogProps {
  record: HistoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (record: HistoryRecord) => void;
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

export function RecordDetailDialog({ record, isOpen, onClose, onEdit }: RecordDetailDialogProps) {
  if (!isOpen || !record) return null;

  const Icon = iconMap[record.type];
  const colors = iconColorMap[record.type];

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl shadow-xl animate-slide-up max-h-[90vh] flex flex-col">
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
          <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm text-muted-foreground mb-2">Что делалось</h3>
            <p className="text-[15px] whitespace-pre-wrap">{record.description}</p>
          </div>

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
          {record.photos && record.photos.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm text-muted-foreground mb-3">Фото чеков</h3>
              <div className="grid grid-cols-2 gap-2">
                {record.photos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-secondary rounded-xl overflow-hidden">
                    <img
                      src={photo}
                      alt={`Чек ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(photo, '_blank')}
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
            onClick={() => onEdit(record)}
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
    </div>
  );
}
