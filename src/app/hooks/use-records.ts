import { useState, useEffect } from 'react';
import { HistoryRecord } from '../components/history-item';
import { NewRecord } from '../components/add-record-dialog';
import { 
  listCarRecords, 
  createCarRecord, 
  updateCarRecord, 
  deleteCarRecord,
  deleteCarRecordImage 
} from '../../api/cars-records';

export function useRecords(selectedCarId: string | null) {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем записи при выборе автомобиля
  useEffect(() => {
    if (selectedCarId) {
      loadRecords(selectedCarId);
    } else {
      setRecords([]);
    }
  }, [selectedCarId]);

  const loadRecords = async (carId: string) => {
    setIsLoading(true);
    try {
      console.log('🔍 Загрузка записей для автомобиля с ID:', carId);
      const data = await listCarRecords(carId);
      console.log('📦 Полученные данные от API:', data);
      
      // Бэкенд возвращает просто массив записей, а не объект с полем records
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('✅ Найдено записей:', data.length);
        // Преобразуем данные из API в формат HistoryRecord
        const transformedRecords: HistoryRecord[] = data.map((record: any) => {
          console.log('🔄 Преобразование записи:', record);
          return transformRecordData(record);
        });
        console.log('🔄 Трансформированные записи:', transformedRecords);
        setRecords(transformedRecords);
      } else if (data && Array.isArray(data) && data.length === 0) {
        console.log('ℹ️ Записи для автомобиля отсутствуют');
        setRecords([]);
      } else {
        console.warn('⚠️ Неожиданный формат данных:', data);
        setRecords([]);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки записей:', error);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async (newRecord: NewRecord, carId: string) => {
    try {
      const data = await createCarRecord({
        car_id: carId,
        record_type: mapRecordTypeToAPI(newRecord.type),
        mileage: newRecord.mileage || '0',
        name: newRecord.title,
        cost: newRecord.cost || '0',
        files: newRecord.photos || [],
        record_date: newRecord.date,
        description: newRecord.description,
        service_place: newRecord.serviceLocation || '',
      });

      if (data) {
        // Перезагружаем список записей
        await loadRecords(carId);
      }
    } catch (error) {
      console.error('Ошибка добавления записи:', error);
    }
  };

  const handleEditRecord = async (updatedRecord: HistoryRecord, carId: string, newPhotos?: File[]) => {
    try {
      const data = await updateCarRecord({
        car_id: carId,
        record_type: mapRecordTypeToAPI(updatedRecord.type),
        mileage: updatedRecord.mileage || '0',
        name: updatedRecord.title,
        cost: updatedRecord.cost || '0',
        files: newPhotos || [],
        record_date: updatedRecord.timestamp,
        description: updatedRecord.description,
        service_place: updatedRecord.serviceLocation || '',
        car_record_id: updatedRecord.id,
      });

      if (data) {
        // Перезагружаем список записей
        await loadRecords(carId);
      }
    } catch (error) {
      console.error('Ошибка обновления записи:', error);
    }
  };

  const handleDeleteRecord = async (recordId: string, carId: string) => {
    try {
      const data = await deleteCarRecord(recordId);
      if (data) {
        // Перезагружаем список записей
        await loadRecords(carId);
      }
    } catch (error) {
      console.error('Ошибка удаления записи:', error);
    }
  };

  const handleDeleteRecordImage = async (recordId: string, imageId: string) => {
    try {
      const data = await deleteCarRecordImage(recordId, imageId);
      if (data) {
        // Перезагружаем список записей
        if (selectedCarId) {
          await loadRecords(selectedCarId);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка удаления изображения:', error);
      return false;
    }
  };

  return {
    records,
    selectedRecord,
    setSelectedRecord,
    handleAddRecord,
    handleEditRecord,
    handleDeleteRecord,
    handleDeleteRecordImage,
    isLoading,
    refreshRecords: () => selectedCarId && loadRecords(selectedCarId),
  };
}

// Вспомогательные функции для маппинга типов
function mapRecordType(apiType: string): HistoryRecord['type'] {
  const typeMap: Record<string, HistoryRecord['type']> = {
    'maintenance': 'maintenance',
    'repair': 'repair',
    'parts': 'parts',
    'inspection': 'inspection',
  };
  return typeMap[apiType] || 'maintenance';
}

function mapRecordTypeToAPI(type: HistoryRecord['type']): string {
  const typeMap: Record<HistoryRecord['type'], string> = {
    'maintenance': 'maintenance',
    'repair': 'repair',
    'parts': 'parts',
    'inspection': 'inspection',
  };
  return typeMap[type];
}

// Функция для трансформации данных из API в формат HistoryRecord
export function transformRecordData(record: any): HistoryRecord {
  return {
    id: (record.car_record_id || record.record_id).toString(),
    type: mapRecordType(record.record_type),
    title: record.name,
    description: record.description || '',
    timestamp: record.record_date,
    time: new Date(record.record_date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    }),
    mileage: record.mileage?.toString(),
    serviceLocation: record.service_place,
    cost: record.cost?.toString(),
    images: record.images?.map((img: any) => ({
      id: img.id.toString(),
      url: img.url
    })) || [],
    photos: record.images?.map((img: any) => img.url) || [],
  };
}