import { useState } from 'react';
import { HistoryRecord } from '../components/history-item';
import { NewRecord } from '../components/add-record-dialog';
import { mockHistory } from '../../api/records';

export function useRecords() {
  const [records, setRecords] = useState<HistoryRecord[]>(mockHistory);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const handleAddRecord = (newRecord: NewRecord) => {
    const record: HistoryRecord = {
      id: Date.now().toString(),
      type: newRecord.type,
      title: newRecord.title,
      description: newRecord.description,
      timestamp: newRecord.date,
      time: new Date(newRecord.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      }),
      mileage: newRecord.mileage,
      serviceLocation: newRecord.serviceLocation,
      cost: newRecord.cost,
      photos: newRecord.photos?.map((file) => URL.createObjectURL(file)),
    };
    setRecords([record, ...records]);
  };

  const handleEditRecord = (updatedRecord: HistoryRecord) => {
    setRecords(records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)));
  };

  return {
    records,
    selectedRecord,
    setSelectedRecord,
    handleAddRecord,
    handleEditRecord,
  };
}
