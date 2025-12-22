// API для работы с записями истории
import { HistoryRecord } from '../app/components/history-item';

export const mockHistory: HistoryRecord[] = [
  {
    id: '1',
    type: 'maintenance',
    title: 'Замена масла',
    description: 'Замена моторного масла и масляного фильтра',
    timestamp: '2024-12-16T10:30:00',
    time: '16 дек',
    mileage: '52000',
    serviceLocation: 'Автосервис "Мастер"',
    cost: '3500',
    photos: [
      'https://images.unsplash.com/photo-1662001164155-2d04179a7b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwcGFwZXJ8ZW58MXx8fHwxNzY1ODkwMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1762427354566-2b6902a9fd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZvaWNlJTIwZG9jdW1lbnR8ZW58MXx8fHwxNzY1ODY3MDczfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: '2',
    type: 'parts',
    title: 'Тормозные колодки',
    description: 'Установка новых передних тормозных колодок',
    timestamp: '2024-12-10T09:15:00',
    time: '10 дек',
    mileage: '51500',
    serviceLocation: 'Автосервис "БМВ Центр"',
    cost: '5200',
    photos: [
      'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0c3xlbnwxfHx8fDE3NjU4OTAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1623068285726-21b0fcabe7f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzZXJ2aWNlJTIwcmVjZWlwdHxlbnwxfHx8fDE3NjU4OTAxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1662001164155-2d04179a7b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwcGFwZXJ8ZW58MXx8fHwxNzY1ODkwMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: '3',
    type: 'inspection',
    title: 'Техосмотр',
    description: 'Плановый технический осмотр автомобиля',
    timestamp: '2024-12-05T08:45:00',
    time: '5 дек',
    mileage: '51200',
    serviceLocation: 'ГИБДД',
    cost: '1500',
  },
  {
    id: '4',
    type: 'repair',
    title: 'Ремонт подвески',
    description: 'Замена амортизаторов и стабилизаторов',
    timestamp: '2024-11-28T08:00:00',
    time: '28 ноя',
    mileage: '50800',
    serviceLocation: 'Автосервис "Подвеска+"',
    cost: '12800',
    photos: [
      'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0c3xlbnwxfHx8fDE3NjU4OTAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1662001164155-2d04179a7b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwcGFwZXJ8ZW58MXx8fHwxNzY1ODkwMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1762427354566-2b6902a9fd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZvaWNlJTIwZG9jdW1lbnR8ZW58MXx8fHwxNzY1ODY3MDczfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1623068285726-21b0fcabe7f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzZXJ2aWNlJTIwcmVjZWlwdHxlbnwxfHx8fDE3NjU4OTAxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0c3xlbnwxfHx8fDE3NjU4OTAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1662001164155-2d04179a7b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwcGFwZXJ8ZW58MXx8fHwxNzY1ODkwMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: '5',
    type: 'maintenance',
    title: 'Замена воздушного фильтра',
    description: 'Установка нового воздушного фильтра двигателя',
    timestamp: '2024-11-20T07:00:00',
    time: '20 ноя',
    mileage: '50200',
    serviceLocation: 'Самостоятельно',
    cost: '800',
  },
  {
    id: '6',
    type: 'parts',
    title: 'Комплект свечей зажигания',
    description: 'Замена свечей зажигания NGK',
    timestamp: '2024-11-15T06:30:00',
    time: '15 ноя',
    mileage: '50000',
    cost: '2400',
    photos: [
      'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0c3xlbnwxfHx8fDE3NjU4OTAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: '7',
    type: 'maintenance',
    title: 'Замена шин',
    description: 'Сезонная замена шин на зимние',
    timestamp: '2024-11-01T22:15:00',
    time: '1 ноя',
    mileage: '49500',
    serviceLocation: 'Шиномонтаж "Колесо"',
    cost: '1200',
  },
  {
    id: '8',
    type: 'inspection',
    title: 'Диагностика двигателя',
    description: 'Компьютерная диагностика всех систем',
    timestamp: '2024-10-20T20:00:00',
    time: '20 окт',
    mileage: '48900',
    serviceLocation: 'Автосервис "Диагност"',
    cost: '1000',
  },
];

export const recordsApi = {
  getRecords: async (): Promise<HistoryRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockHistory);
      }, 300);
    });
  },

  addRecord: async (record: Omit<HistoryRecord, 'id'>): Promise<HistoryRecord> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...record,
          id: Date.now().toString(),
        });
      }, 300);
    });
  },

  updateRecord: async (record: HistoryRecord): Promise<HistoryRecord> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(record);
      }, 300);
    });
  },
};
