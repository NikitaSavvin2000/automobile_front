import ChangePasswordPage from "./components/change-password";
import { useState, useRef, useEffect } from "react";
import { Search, Plus, Car as CarIcon, Gauge, Edit2 } from "lucide-react";
import { HistoryItem, HistoryRecord } from "./components/history-item";
import { BottomNav, NavTab } from "./components/bottom-nav";
import { AddCarDialog, Car } from "./components/add-car-dialog";
import { CarSelector, CarHeader } from "./components/car-selector";
import { EditMileageDialog } from "./components/edit-mileage-dialog";
import { ComingSoon } from "./components/coming-soon";
import { Settings } from "./components/settings";
import { AddRecordDialog, NewRecord } from "./components/add-record-dialog";
import { RecordDetailDialog } from "./components/record-detail-dialog";
import { EditRecordDialog } from "./components/edit-record-dialog";
import { ThemeProvider } from "./context/theme-context";
import { AuthPage } from "./components/auth-page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAutoRefreshToken } from "../utils/token-refresher";

// Данные автомобилей для примера
const initialCars: Car[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Camry",
    year: "2020",
    mileage: "52000",
    color: "Черный",
  },
  {
    id: "2",
    brand: "BMW",
    model: "X5",
    year: "2019",
    mileage: "68000",
    color: "Белый",
  },
];

// Данные истории автомобиля для примера
const mockHistory: HistoryRecord[] = [
  {
    id: "1",
    type: "maintenance",
    title: "Замена масла",
    description: "Замена моторного масла и масляного фильтра",
    timestamp: "2024-12-16T10:30:00",
    time: "16 дек",
    mileage: "52000",
    serviceLocation: 'Автосервис "Мастер"',
    cost: "3500",
    photos: [
      "https://images.unsplash.com/photo-1662001164155-2d04179a7b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwcGFwZXJ8ZW58MXx8fHwxNzY1ODkwMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1762427354566-2b6902a9fd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZvaWNlJTIwZG9jdW1lbnR8ZW58MXx8fHwxNzY1ODY3MDczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "2",
    type: "parts",
    title: "Тормозные колодки",
    description: "Установка новых передних тормозных колодок",
    timestamp: "2024-12-10T09:15:00",
    time: "10 дек",
    mileage: "51500",
    serviceLocation: 'Автосервис "БМВ Центр"',
    cost: "5200",
    photos: [
      "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0c3xlbnwxfHx8fDE3NjU4OTAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1623068285726-21b0fcabe7f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzZXJ2aWNlJTIwcmVjZWlwdHxlbnwxfHx8fDE3NjU4OTAxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1662001164155-2d04179a7b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwcGFwZXJ8ZW58MXx8fHwxNzY1ODkwMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "3",
    type: "inspection",
    title: "Техосмотр",
    description: "Плановый технический осмотр автомобиля",
    timestamp: "2024-12-05T08:45:00",
    time: "5 дек",
    mileage: "51200",
    serviceLocation: "ГИБДД",
    cost: "1500",
  },
  {
    id: "4",
    type: "repair",
    title: "Ремонт подвески",
    description: "Замена амортизаторов и стабилизаторов",
    timestamp: "2024-11-28T08:00:00",
    time: "28 ноя",
    mileage: "50800",
    serviceLocation: 'Автосервис "Подвеска+"',
    cost: "12800",
    photos: [
      "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0c3xlbnwxfHx8fDE3NjU4OTAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1662001164155-2d04179a7b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwcGFwZXJ8ZW58MXx8fHwxNzY1ODkwMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1762427354566-2b6902a9fd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZvaWNlJTIwZG9jdW1lbnR8ZW58MXx8fHwxNzY1ODY3MDczfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1623068285726-21b0fcabe7f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzZXJ2aWNlJTIwcmVjZWlwdHxlbnwxfHx8fDE3NjU4OTAxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0c3xlbnwxfHx8fDE3NjU4OTAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1662001164155-2d04179a7b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwcGFwZXJ8ZW58MXx8fHwxNzY1ODkwMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "5",
    type: "maintenance",
    title: "Замена воздушного фильтра",
    description: "Установка нового воздушного фильтра двигателя",
    timestamp: "2024-11-20T07:00:00",
    time: "20 ноя",
    mileage: "50200",
    serviceLocation: "Самостоятельно",
    cost: "800",
  },
  {
    id: "6",
    type: "parts",
    title: "Комплект свечей зажигания",
    description: "Замена свечей зажигания NGK",
    timestamp: "2024-11-15T06:30:00",
    time: "15 ноя",
    mileage: "50000",
    cost: "2400",
    photos: [
      "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0c3xlbnwxfHx8fDE3NjU4OTAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "7",
    type: "maintenance",
    title: "Замена шин",
    description: "Сезонная замена шин на зимние",
    timestamp: "2024-11-01T22:15:00",
    time: "1 ноя",
    mileage: "49500",
    serviceLocation: 'Шиномонтаж "Колесо"',
    cost: "1200",
  },
  {
    id: "8",
    type: "inspection",
    title: "Диагностика двигателя",
    description: "Компьютерная диагностика всех систем",
    timestamp: "2024-10-20T20:00:00",
    time: "20 окт",
    mileage: "48900",
    serviceLocation: 'Автосервис "Диагност"',
    cost: "1000",
  },
];

export default function App() {
  const { tokens, setTokens } = useAutoRefreshToken();

  // Состояние авторизации
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState<NavTab>("history");

  useEffect(() => {
    const savedAccessToken = localStorage.getItem("token");
    const savedRefreshToken = localStorage.getItem("refresh_token");

    if (savedAccessToken || savedRefreshToken) {
      if (!isAuthenticated) {
        setIsAuthenticated(true);
        const email = localStorage.getItem("userEmail") || "";
        setUserName(email.split("@")[0] || "Пользователь");
      }
    }
  }, []);

  useEffect(() => {
    console.log("Текущие токены обновились:", tokens);
    if (!tokens.access_token && !tokens.refresh_token && isAuthenticated) {
      const savedAccessToken = localStorage.getItem("token");
      const savedRefreshToken = localStorage.getItem("refresh_token");

      if (!savedAccessToken && !savedRefreshToken) {
        console.log("Токены отсутствуют, выход из аккаунта");
        setIsAuthenticated(false);
        setUserName("");
        setActiveTab("history");
      }
    }
  }, [tokens, isAuthenticated]);

  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<HistoryRecord[]>(mockHistory);
  const [authScreen, setAuthScreen] = useState<"auth" | "changePassword">("auth");

  const [cars, setCars] = useState<Car[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<Car>(initialCars[0]);
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [isCarSelectorOpen, setIsCarSelectorOpen] = useState(false);
  const [isEditMileageOpen, setIsEditMileageOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [isRecordDetailOpen, setIsRecordDetailOpen] = useState(false);
  const [isEditRecordOpen, setIsEditRecordOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleLogin = (email: string, password: string, name?: string) => {
    // Простая логика - принимаем любые данные
    setIsAuthenticated(true);
    setUserName(name || email.split("@")[0] || "Пользователь");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    setActiveTab("history");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userEmail");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        setIsScrolled(scrollTop > 20);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleAddCar = (newCar: Omit<Car, "id">) => {
    const car: Car = {
      ...newCar,
      id: Date.now().toString(),
    };
    setCars([...cars, car]);
    setSelectedCar(car);
  };

  const handleUpdateMileage = (newMileage: string) => {
    const updatedCar = { ...selectedCar, mileage: newMileage };
    setSelectedCar(updatedCar);
    setCars(cars.map((car) => (car.id === selectedCar.id ? updatedCar : car)));
  };

  const handleAddRecord = (newRecord: NewRecord) => {
    const record: HistoryRecord = {
      id: Date.now().toString(),
      type: newRecord.type,
      title: newRecord.title,
      description: newRecord.description,
      timestamp: newRecord.date,
      time: new Date(newRecord.date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
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
    setIsEditRecordOpen(false);
    setIsRecordDetailOpen(false);
  };

  const handleOpenRecordDetail = (record: HistoryRecord) => {
    setSelectedRecord(record);
    setIsRecordDetailOpen(true);
  };

  const handleOpenEditRecord = (record: HistoryRecord) => {
    setSelectedRecord(record);
    setIsRecordDetailOpen(false);
    setIsEditRecordOpen(true);
  };

  const filterByTab = (record: HistoryRecord) => {
    if (activeTab === "all") return true;
    if (activeTab === "history") return record.type === "inspection";
    if (activeTab === "findService") return false; // Не показываем записи для "Скоро будет"
    if (activeTab === "findParts") return false; // Не показываем записи для "Скоро будет"
    if (activeTab === "settings") return false; // Не показываем записи для "Настроек"
    return true;
  };

  const filteredRecords = records
    .filter(filterByTab)
    .filter(
      (record) =>
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Проверка, нужно ли показать экран "Скоро будет"
  const showComingSoon = activeTab === "findService" || activeTab === "findParts";
  const showSettings = activeTab === "settings";
  const showCarBlock = !showSettings;

  // Если не авторизован, показываем экран авторизации
  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        {authScreen === "auth" && (
          <AuthPage
            onLogin={handleLogin}
            onChangePassword={() => setAuthScreen("changePassword")}
            setTokens={setTokens}
          />
        )}

        {authScreen === "changePassword" && (
          <ChangePasswordPage onBack={() => setAuthScreen("auth")} />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="h-screen w-full max-w-md mx-auto bg-secondary/30 flex flex-col">
        {/* Блок автомобиля - скрываем для настроек */}
        {showCarBlock && (
          <div className="p-4 pb-2">
            <div
              className={`bg-white dark:bg-card rounded-2xl shadow-sm transition-all duration-300 ${
                isScrolled ? "p-3" : "p-4"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <CarHeader car={selectedCar} onOpenSelector={() => setIsCarSelectorOpen(true)} />
                <button
                  onClick={() => setIsAddCarDialogOpen(true)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5 text-primary" />
                </button>
              </div>

              <div
                className={`flex items-center justify-between transition-all duration-300 ${
                  isScrolled ? "gap-3" : "gap-4"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`bg-primary/10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isScrolled ? "p-2" : "p-3"
                    }`}
                  >
                    <CarIcon
                      className={`text-primary transition-all duration-300 ${
                        isScrolled ? "w-7 h-7" : "w-10 h-10"
                      }`}
                    />
                  </div>
                  <div>
                    <h2
                      className={`transition-all duration-300 ${
                        isScrolled ? "text-base" : "text-lg"
                      }`}
                    >
                      {selectedCar.brand} {selectedCar.model}
                    </h2>
                    {!isScrolled && (
                      <p className="text-xs text-muted-foreground">
                        {selectedCar.year} год {selectedCar.color && `• ${selectedCar.color}`}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`bg-secondary rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    isScrolled ? "px-3 py-2" : "px-4 py-2.5"
                  }`}
                >
                  <Gauge
                    className={`text-primary transition-all duration-300 ${
                      isScrolled ? "w-4 h-4" : "w-5 h-5"
                    }`}
                  />
                  <div className="text-left">
                    {!isScrolled && <p className="text-[10px] text-muted-foreground">Пробег</p>}
                    <p
                      className={`transition-all duration-300 ${
                        isScrolled ? "text-sm" : "text-base"
                      }`}
                    >
                      {Number(selectedCar.mileage).toLocaleString()} км
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditMileageOpen(true)}
                    className="p-1.5 hover:bg-white dark:hover:bg-card rounded-full transition-colors"
                  >
                    <Edit2
                      className={`text-primary transition-all duration-300 ${
                        isScrolled ? "w-3 h-3" : "w-3.5 h-3.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
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
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-2">
          {showSettings ? (
            <Settings userName={userName} onLogout={handleLogout} />
          ) : showComingSoon ? (
            <ComingSoon type={activeTab === "findService" ? "service" : "parts"} />
          ) : filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <HistoryItem
                key={record.id}
                record={record}
                onClick={() => handleOpenRecordDetail(record)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-foreground">Ничего не найдено</h3>
              <p className="text-sm text-muted-foreground">Попробуйте изменить поисковый запрос</p>
            </div>
          )}
        </div>

        {/* Нижнее меню-таблетка */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Диалоги */}
        <AddCarDialog
          isOpen={isAddCarDialogOpen}
          onClose={() => setIsAddCarDialogOpen(false)}
          onAdd={handleAddCar}
        />

        <CarSelector
          cars={cars}
          selectedCar={selectedCar}
          isOpen={isCarSelectorOpen}
          onToggle={() => setIsCarSelectorOpen(false)}
          onSelect={setSelectedCar}
        />

        <EditMileageDialog
          isOpen={isEditMileageOpen}
          currentMileage={selectedCar.mileage}
          onClose={() => setIsEditMileageOpen(false)}
          onSave={handleUpdateMileage}
        />

        <AddRecordDialog
          isOpen={isAddRecordOpen}
          onClose={() => setIsAddRecordOpen(false)}
          onAdd={handleAddRecord}
        />

        <RecordDetailDialog
          record={selectedRecord}
          isOpen={isRecordDetailOpen}
          onClose={() => setIsRecordDetailOpen(false)}
          onEdit={handleOpenEditRecord}
        />

        <EditRecordDialog
          record={selectedRecord}
          isOpen={isEditRecordOpen}
          onClose={() => setIsEditRecordOpen(false)}
          onSave={handleEditRecord}
        />
      </div>
    </ThemeProvider>
  );
}
