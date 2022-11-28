import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Type } from './type.entity';

@Injectable()
export class TypeService {
  constructor(
    @Inject('TYPE_REPOSITORY')
    private typeRepository: Repository<Type>,
  ) {}

  async getList(user_id: number) {
    const QUERY_STR = 'id, name, type';
    let sql = `select ${QUERY_STR} from types`;
    const result = await this.typeRepository.query(sql);
    return result;
  }
}
