import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { HistoryRecord } from '../components/history-item';
import { BottomNav, NavTab } from '../components/bottom-nav';
import { Car, AddCarDialog } from '../components/add-car-dialog';
import { EditMileageDialog } from '../components/edit-mileage-dialog';
import { ComingSoon } from '../components/coming-soon';
import { Settings } from '../components/settings';
import { AddRecordDialog, NewRecord } from '../components/add-record-dialog';
import { RecordDetailDialog } from '../components/record-detail-dialog';
import { EditRecordDialog } from '../components/edit-record-dialog';
import { HistoryPage } from './history-page';
import { useScroll } from '../hooks/use-scroll';
import { CarManagementHeader } from '../components/car-management-header';
import { CarSelectorModal } from '../components/car-selector-modal';
import { EditCarModal } from '../components/edit-car-modal';
import { getCarRecordInfo } from '../../api/cars-records';
import { transformRecordData } from '../hooks/use-records';

interface MainPageProps {
  userName: string;
  cars: Car[];
  selectedCar: Car | null;
  records: HistoryRecord[];
  onLogout: () => void;
  onSelectCar: (car: Car) => void;
  onAddCar: (car: Omit<Car, 'id'>) => void;
  onUpdateCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
  onUpdateMileage: (mileage: string) => void;
  onAddRecord: (record: NewRecord, carId: string) => Promise<void>;
  onEditRecord: (record: HistoryRecord, carId: string, newPhotos?: File[]) => Promise<void>;
  onDeleteRecord: (recordId: string, carId: string) => Promise<void>;
  onDeleteRecordImage: (recordId: string, imageId: string) => Promise<boolean>;
  selectedRecord: HistoryRecord | null;
  onSelectRecord: (record: HistoryRecord | null) => void;
}

export function MainPage({
  userName,
  cars,
  selectedCar,
  records,
  onLogout,
  onSelectCar,
  onAddCar,
  onUpdateCar,
  onDeleteCar,
  onUpdateMileage,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onDeleteRecordImage,
  selectedRecord,
  onSelectRecord,
}: MainPageProps) {
  const [activeTab, setActiveTab] = useState<NavTab>('history');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [isCarSelectorOpen, setIsCarSelectorOpen] = useState(false);
  const [isEditCarOpen, setIsEditCarOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isEditMileageOpen, setIsEditMileageOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isRecordDetailOpen, setIsRecordDetailOpen] = useState(false);
  const [isEditRecordOpen, setIsEditRecordOpen] = useState(false);

  const { isScrolled, scrollContainerRef } = useScroll();

  const showComingSoon = activeTab === 'findService' || activeTab === 'findParts';
  const showSettings = activeTab === 'settings';
  const showCarBlock = !showSettings;

  const handleOpenRecordDetail = (record: HistoryRecord) => {
    onSelectRecord(record);
    setIsRecordDetailOpen(true);
  };

  const handleOpenEditRecord = (record: HistoryRecord) => {
    onSelectRecord(record);
    setIsRecordDetailOpen(false);
    setIsEditRecordOpen(true);
  };

  const handleEditRecord = async (record: HistoryRecord, newPhotos?: File[]) => {
    await onEditRecord(record, selectedCar?.id || '', newPhotos);
    
    // После сохранения загружаем обновленную запись из бэкенда
    if (selectedCar?.id && record.id) {
      const apiData = await getCarRecordInfo(selectedCar.id, record.id);
      if (apiData) {
        // Преобразуем данные из API в формат HistoryRecord
        const updatedRecord = transformRecordData(apiData);
        onSelectRecord(updatedRecord);
      }
    }
    
    // ВАЖНО: Сначала открываем детальный просмотр, ПОТОМ закрываем форму редактирования
    // Это создает плавный переход без показа главного экрана
    setIsRecordDetailOpen(true);
    setIsEditRecordOpen(false);
  };

  const handleDeleteRecord = async () => {
    if (selectedRecord && selectedCar?.id) {
      await onDeleteRecord(selectedRecord.id, selectedCar.id);
      setIsRecordDetailOpen(false);
      setIsEditRecordOpen(false);
      onSelectRecord(null);
    }
  };

  const handleEditCarFromSelector = (car: Car) => {
    setCarToEdit(car);
    setIsEditCarOpen(true);
  };

  const handleDeleteCarFromSelector = (car: Car) => {
    setCarToDelete(car);
  };

  const handleConfirmDelete = () => {
    if (carToDelete) {
      onDeleteCar(carToDelete.id);
      setCarToDelete(null);
      setIsCarSelectorOpen(false);
    }
  };

  const filterByTab = (record: HistoryRecord) => {
    // Вкладка "История" показывает все записи
    if (activeTab === 'history') return true;
    if (activeTab === 'all') return true;
    return false;
  };

  const filteredRecords = records.filter(filterByTab);
  
  console.log('📊 Статистика записей:', {
    всегоЗаписей: records.length,
    послеФильтрации: filteredRecords.length,
    активнаяВкладка: activeTab,
    записи: records.map(r => ({ id: r.id, type: r.type, title: r.title }))
  });

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-secondary/60 flex flex-col">
      {/* Блок управления автомобилем */}
      {showCarBlock && (
        <CarManagementHeader
          selectedCar={selectedCar}
          isScrolled={isScrolled}
          onOpenCarSelector={() => setIsCarSelectorOpen(true)}
          onOpenAddCar={() => setIsAddCarDialogOpen(true)}
          onOpenEditCar={() => {
            if (selectedCar) {
              setCarToEdit(selectedCar);
              setIsEditCarOpen(true);
            }
          }}
          onOpenEditMileage={() => setIsEditMileageOpen(true)}
        />
      )}

      {/* Поле поиска - скрываем для "Скоро будет" и настроек */}
      {!showComingSoon && !showSettings && (
        <div className="px-4 pb-3">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-card rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
            </div>
            <button
              onClick={() => setIsAddRecordOpen(true)}
              className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Список истории или экран "Скоро будет" или настройки */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-24">
        {showSettings ? (
          <Settings onLogout={onLogout} />
        ) : showComingSoon ? (
          <ComingSoon type={activeTab === 'findService' ? 'service' : 'parts'} />
        ) : (
          <HistoryPage
            records={filteredRecords}
            searchQuery={searchQuery}
            onRecordClick={handleOpenRecordDetail}
          />
        )}
      </div>

      {/* Нижнее меню-таблетка */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Диалоги */}
      <AddCarDialog
        isOpen={isAddCarDialogOpen}
        onClose={() => setIsAddCarDialogOpen(false)}
        onAdd={onAddCar}
      />

      <CarSelectorModal
        isOpen={isCarSelectorOpen}
        cars={cars}
        selectedCar={selectedCar}
        onClose={() => setIsCarSelectorOpen(false)}
        onSelect={onSelectCar}
        onEdit={handleEditCarFromSelector}
        onDelete={handleDeleteCarFromSelector}
        onAdd={() => setIsAddCarDialogOpen(true)}
      />

      <EditCarModal
        isOpen={isEditCarOpen}
        car={carToEdit}
        onClose={() => {
          setIsEditCarOpen(false);
          setCarToEdit(null);
        }}
        onSave={onUpdateCar}
        onDelete={onDeleteCar}
      />

      <EditMileageDialog
        isOpen={isEditMileageOpen}
        currentMileage={selectedCar?.mileage || ''}
        onClose={() => setIsEditMileageOpen(false)}
        onSave={onUpdateMileage}
      />

      <AddRecordDialog
        isOpen={isAddRecordOpen}
        onClose={() => setIsAddRecordOpen(false)}
        onAdd={(record) => onAddRecord(record, selectedCar?.id || '')}
      />

      <RecordDetailDialog
        record={selectedRecord}
        isOpen={isRecordDetailOpen}
        onClose={() => setIsRecordDetailOpen(false)}
        onEdit={handleOpenEditRecord}
        onDelete={handleDeleteRecord}
        carId={selectedCar?.id}
        onDeleteImage={onDeleteRecordImage}
      />

      <EditRecordDialog
        record={selectedRecord}
        isOpen={isEditRecordOpen}
        onClose={() => setIsEditRecordOpen(false)}
        onSave={handleEditRecord}
        onDeleteImage={onDeleteRecordImage}
        onDelete={handleDeleteRecord}
        carId={selectedCar?.id}
      />

      {/* Диалог подтверждения удаления */}
      {carToDelete && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
            onClick={() => setCarToDelete(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-card rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mx-auto w-fit mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Удалить автомобиль?</h2>
                <p className="text-muted-foreground mb-6">
                  {carToDelete.brand} {carToDelete.model} будет удалён безвозвратно
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCarToDelete(null)}
                    className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleConfirmDelete}
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