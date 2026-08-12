import { AchievementItem, GalleryItem } from '@/types';

export const centerInfo = {
  name: 'FLEEPP',
  fullName: 'Fleepp Education Management App',
  founded: 2019,
  mission:
    'Мо кӯшиш менамоем, ки ба ҳар довталаб роҳи мустақим ба донишгоҳи дилхоҳашро тавассути таълими босифат ва назорати доимии натиҷаҳо кушоем.',
  history:
    'Маркази таълимии FLEEPP соли 2019 бо як синфхона ва 12 довталаб оғоз ёфт. Имрӯз мо чандин гурӯҳ дар фанҳои математика, физика, химия ва забони англисӣ дорем ва садҳо хатмкунандаро ба донишгоҳҳои беҳтарин роҳнамоӣ кардем.',
  address: 'ш. Душанбе, кӯчаи Рӯдакӣ 45',
  phone: '+992 37 221 00 00',
  email: 'info@fleepp.tj',
  workingHours: 'Ҳар рӯз, 8:00 – 19:00 (якшанбе истироҳат)',
};

export const achievements: AchievementItem[] = [
  { id: 'a1', year: '2021', title: 'Аввалин хатми пурра', description: '35 довталаб бо баллҳои баланд ба донишгоҳҳо дохил шуданд.' },
  { id: 'a2', year: '2022', title: 'Кушодани гурӯҳи химия', description: 'Барномаи нави таълими химия бо лабораторияи муосир оғоз ёфт.' },
  { id: 'a3', year: '2023', title: '90%+ қабул', description: 'Зиёда аз 90% довталабони FLEEPP ба донишгоҳҳои давлатӣ қабул шуданд.' },
  { id: 'a4', year: '2024', title: 'Барномаи мобилӣ', description: 'Барномаи идоракунии FLEEPP барои назорати натиҷа ва алоқа бо волидайн оғоз ёфт.' },
];

export const gallery: GalleryItem[] = [
  { id: 'ph1', emoji: '🏫', caption: 'Бинои марказ' },
  { id: 'ph2', emoji: '📚', caption: 'Дарси математика' },
  { id: 'ph3', emoji: '🧪', caption: 'Лабораторияи химия' },
  { id: 'ph4', emoji: '🎓', caption: 'Ҷашни хатм 2024' },
  { id: 'ph5', emoji: '🏆', caption: 'Олимпиадаи ҷумҳуриявӣ' },
  { id: 'ph6', emoji: '👩‍🏫', caption: 'Дарси забони англисӣ' },
];
