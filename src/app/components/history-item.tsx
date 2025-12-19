import { Wrench, Package, ClipboardCheck, AlertCircle } from "lucide-react";

export interface HistoryRecord {
  id: string;
  type: 'maintenance' | 'repair' | 'parts' | 'inspection';
  title: string;
  description: string;
  timestamp: string;
  time: string;
  mileage?: string;
  serviceLocation?: string;
  cost?: string;
  photos?: string[];
}

interface HistoryItemProps {
  record: HistoryRecord;
  onClick?: () => void;
}

const iconMap = {
  maintenance: Wrench,
  repair: AlertCircle,
  parts: Package,
  inspection: ClipboardCheck,
};

const iconColorMap = {
  maintenance: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  repair: { bg: 'bg-red-500/10', text: 'text-red-500' },
  parts: { bg: 'bg-green-500/10', text: 'text-green-600' },
  inspection: { bg: 'bg-orange-500/10', text: 'text-orange-600' },
};

export function HistoryItem({ record, onClick }: HistoryItemProps) {
  const Icon = iconMap[record.type];
  const colors = iconColorMap[record.type];
  
  return (
    <div className="px-4 mb-2 first:mt-0">
      <button
        onClick={onClick}
        className="w-full flex items-start gap-3 p-4 hover:bg-secondary/50 transition-colors bg-white dark:bg-card rounded-2xl shadow-sm text-left"
      >
        <div className={`${colors.bg} rounded-xl p-2.5 flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 mb-1.5">
            <h3 className="text-foreground font-medium">
              {record.title}
            </h3>
            <span className="text-sm text-muted-foreground shrink-0">
              {record.time}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {record.mileage && (
              <span className="font-medium">
                {Number(record.mileage).toLocaleString()} км
              </span>
            )}
            {record.serviceLocation && (
              <>
                {record.mileage && <span>•</span>}
                <span className="truncate">
                  {record.serviceLocation}
                </span>
              </>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}