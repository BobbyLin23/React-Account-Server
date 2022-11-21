import { DataSource } from 'typeorm';
import { Bill } from './bill.entity';

export const billProvider = [
  {
    provide: 'BILL_REPOSITORY',
    useFactory: (datasource: DataSource) => datasource.getRepository(Bill),
    inject: ['DATA_SOURCE'],
  },
];
