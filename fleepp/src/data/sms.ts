import { SmsMessage } from '@/types';

export const initialSmsHistory: SmsMessage[] = [
  {
    id: 'sms1',
    studentId: 's1',
    parentId: 'p1',
    text: 'Ассалому алайкум! Ориён дар санҷиши охирин 92% натиҷа нишон дод. Табрик мегӯем!',
    sentAt: '2025-11-12T09:15:00',
    sentByUserId: 'u-admin',
    status: 'дастрас шуд',
  },
  {
    id: 'sms2',
    studentId: 's3',
    parentId: 'p3',
    text: 'Ҳурматӣ падари Сомон! Лутфан барои сӯҳбат дар бораи ҳузур ба марказ занг занед.',
    sentAt: '2025-11-14T14:02:00',
    sentByUserId: 'u-admin',
    status: 'фиристода шуд',
  },
  {
    id: 'sms3',
    studentId: 's9',
    parentId: 'p9',
    text: 'Умед барои санҷиши ММТ-и таҷрибавӣ рӯзи шанбе бояд соати 9:00 ҳозир бошад.',
    sentAt: '2025-11-15T11:30:00',
    sentByUserId: 'u-admin',
    status: 'дастрас шуд',
  },
  {
    id: 'sms4',
    studentId: 's10',
    parentId: 'p10',
    text: 'Натиҷаи Зарина дар санҷиши физика паст шуд. Лутфан бо муаллим тамос гиред.',
    sentAt: '2025-11-16T08:45:00',
    sentByUserId: 'u-admin',
    status: 'ноком шуд',
  },
];
