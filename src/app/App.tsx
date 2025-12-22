import { ThemeProvider } from './context/theme-context';
import { useAuth, useCars, useRecords } from './hooks';
import { useAutoRefreshToken } from '../utils/token-refresher';
import { AuthPageWrapper, MainPage } from './pages';
import { useEffect } from 'react';

export default function App() {
  const { tokens, setTokens } = useAutoRefreshToken();
  const { isAuthenticated, userName, handleLogin, handleLogout, isInitialized } = useAuth();
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
  } = useRecords();

  // Загружаем данные после успешного логина
  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      console.log('Пользователь авторизован, загружаем данные...');
      // Обновляем список автомобилей
      refreshCars();
    }
  }, [isAuthenticated, isInitialized]);

  // Показываем загрузку пока не инициализирована авторизация
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

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <AuthPageWrapper onLogin={handleLogin} setTokens={setTokens} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
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
      />
    </ThemeProvider>
  );
}