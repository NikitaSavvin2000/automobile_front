import { Search } from 'lucide-react';
import { HistoryItem, HistoryRecord } from '../components/history-item';

interface HistoryPageProps {
  records: HistoryRecord[];
  searchQuery: string;
  onRecordClick: (record: HistoryRecord) => void;
}

export function HistoryPage({ records, searchQuery, onRecordClick }: HistoryPageProps) {
  const filteredRecords = records.filter(
    (record) =>
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-foreground">Ничего не найдено</h3>
        <p className="text-sm text-muted-foreground">Попробуйте изменить поисковый запрос</p>
      </div>
    );
  }

  return (
    <>
      {filteredRecords.map((record) => (
        <HistoryItem key={record.id} record={record} onClick={() => onRecordClick(record)} />
      ))}
    </>
  );
}
