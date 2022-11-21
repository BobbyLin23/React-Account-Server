import { DataSource } from 'typeorm';
import { Type } from './type.entity';

export const typeProvider = [
  {
    provide: 'TYPE_REPOSITORY',
    useFactory: (datasource: DataSource) => datasource.getRepository(Type),
    inject: ['DATA_SOURCE'],
  },
];
