import { useState, useEffect } from 'react';
import { Car } from '../components/add-car-dialog';
import { getCars, createCar, updateCar, deleteCar } from '../../api/cars';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // Загружаем сохраненный selectedCarId из localStorage
  useEffect(() => {
    const savedCarId = localStorage.getItem('selectedCarId');
    if (savedCarId) {
      setSelectedCarId(savedCarId);
    }
    setIsInitialized(true);
  }, []);

  // Загружаем автомобили только если пользователь авторизован
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isInitialized && token) {
      loadCars();
    }
  }, [isInitialized, needsRefresh]);

  const loadCars = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Нет токена для загрузки автомобилей');
      return;
    }

    setIsLoading(true);
    const result = await getCars();
    if (result && result.length > 0) {
      setCars(result);
      
      // Если нет выбранного авто, выбираем первый
      if (!selectedCarId) {
        const firstCarId = result[0].id;
        setSelectedCarId(firstCarId);
        localStorage.setItem('selectedCarId', firstCarId);
      } else {
        // Проверяем, существует ли выбранный автомобиль
        const carExists = result.some((c: Car) => c.id === selectedCarId);
        if (!carExists && result.length > 0) {
          const firstCarId = result[0].id;
          setSelectedCarId(firstCarId);
          localStorage.setItem('selectedCarId', firstCarId);
        }
      }
    } else {
      setCars([]);
      setSelectedCarId(null);
      localStorage.removeItem('selectedCarId');
    }
    setIsLoading(false);
    setNeedsRefresh(false);
  };

  // Публичный метод для принудительной перезагрузки автомобилей
  const refreshCars = () => {
    setNeedsRefresh(true);
  };

  const handleAddCar = async (newCar: Omit<Car, 'id'>) => {
    const result = await createCar(
      newCar.brand,
      newCar.model,
      newCar.year,
      newCar.mileage,
      newCar.color
    );
    
    if (result) {
      // Перезагружаем список автомобилей с сервера
      refreshCars();
    }
  };

  const handleUpdateCar = async (updatedCar: Car) => {
    const result = await updateCar(
      updatedCar.id,
      updatedCar.brand,
      updatedCar.model,
      updatedCar.year,
      updatedCar.mileage,
      updatedCar.color
    );
    
    if (result) {
      // Перезагружаем список автомобилей с сервера
      refreshCars();
    }
  };

  const handleDeleteCar = async (carId: string) => {
    const result = await deleteCar(carId);
    
    if (result) {
      // Перезагружаем список автомобилей с сервера
      refreshCars();
    }
  };

  const handleSelectCar = (car: Car) => {
    setSelectedCarId(car.id);
    localStorage.setItem('selectedCarId', car.id);
  };

  const handleUpdateMileage = async (newMileage: string) => {
    const selectedCar = cars.find((car) => car.id === selectedCarId);
    if (!selectedCar) return;
    
    const updatedCar = { ...selectedCar, mileage: newMileage };
    await handleUpdateCar(updatedCar);
  };

  const selectedCar = cars.find((car) => car.id === selectedCarId) || null;

  return {
    cars,
    selectedCar,
    handleSelectCar,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    handleUpdateMileage,
    isLoading,
    refreshCars,
  };
}