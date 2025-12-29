import { ThemeProvider } from './context/theme-context';
import { useAuth, useCars, useRecords } from './hooks';
import { useAutoRefreshToken } from '../utils/token-refresher';
import { AuthPageWrapper, MainPage } from './pages';
import { useEffect } from 'react';
import { getCarRecordInfo } from '../api/cars-records';
import { transformRecordData } from './hooks/use-records';
import { useVersionCheck } from "./hooks/use-version-check";
import { UpdateRequiredModal } from "./components/update-required-modal";

const APP_VERSION = "1.2.0";

export default function App() {
  const { tokens, setTokens } = useAutoRefreshToken();
  const { isAuthenticated, userName, handleLogin, handleLogout, isInitialized } = useAuth();
  const versionData = useVersionCheck(APP_VERSION);

  const {
    cars,
    selectedCar,
    handleSelectCar,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    handleUpdateMileage,
    refreshCars,
  } = useCars();

  const {
    records,
    selectedRecord,
    setSelectedRecord,
    handleAddRecord,
    handleEditRecord,
    handleDeleteRecord,
    handleDeleteRecordImage,
  } = useRecords(selectedCar?.id || null);

  useEffect(() => {
    console.log('🎯 Текущий выбранный автомобиль:', selectedCar);
    console.log('🎯 ID выбранного автомобиля:', selectedCar?.id, 'тип:', typeof selectedCar?.id);
  }, [selectedCar]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) refreshCars();
  }, [isAuthenticated, isInitialized]);

  const handleDeleteRecordImageWithUpdate = async (recordId: string, imageId: string) => {
    const success = await handleDeleteRecordImage(recordId, imageId);
    if (success && selectedCar?.id && selectedRecord?.id) {
      const apiData = await getCarRecordInfo(selectedCar.id, selectedRecord.id);
      if (apiData) setSelectedRecord(transformRecordData(apiData));
    }
    return success;
  };

  if (!isInitialized) {
    return (
      <ThemeProvider>
        <div className="h-screen w-full flex items-center justify-center bg-secondary/30">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

return (
      <ThemeProvider>
        {versionData && <UpdateRequiredModal data={versionData} />}

        {!isAuthenticated ? (
          <AuthPageWrapper onLogin={handleLogin} setTokens={setTokens} />
        ) : (
          <MainPage
            userName={userName}
            cars={cars}
            selectedCar={selectedCar}
            records={records}
            onLogout={handleLogout}
            onSelectCar={handleSelectCar}
            onAddCar={handleAddCar}
            onUpdateCar={handleUpdateCar}
            onDeleteCar={handleDeleteCar}
            onUpdateMileage={handleUpdateMileage}
            onAddRecord={handleAddRecord}
            onEditRecord={handleEditRecord}
            selectedRecord={selectedRecord}
            onSelectRecord={setSelectedRecord}
            onDeleteRecord={handleDeleteRecord}
            onDeleteRecordImage={handleDeleteRecordImageWithUpdate}
          />
        )}
      </ThemeProvider>
    );
}
