import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';

@Injectable()
export class BillService {
  constructor(
    @Inject('BILL_REPOSITORY')
    private billRepository: Repository<Bill>,
  ) {}

  async addBill(user_id: number, params: any) {
    let bill = new Bill();
    bill.amount = params.amount;
    bill.date = params.date;
    bill.type_id = params.type_id;
    bill.type_name = params.type_name;
    bill.pay_type = params.pay_type;
    bill.remark = params.remark;
    bill.user_id = user_id;
    return this.billRepository.save(bill);
  }

  async getList(user_id: number): Promise<Bill[]> {
    const SQL_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
    const sql = `select ${SQL_STR} from bill where user_id = ${user_id}`;
    const result = await this.billRepository.query(sql);
    return result;
  }

  async getDetail(id: number, user_id: number) {
    return await this.billRepository.find({
      where: {
        id: id,
        user_id: user_id,
      },
    });
  }

  async updateBill(params) {
    let bill = await this.billRepository.findOne({
      where: {
        id: params.id,
      },
    });
    bill.amount = params.amount ? params.amount : bill.amount;
    bill.date = params.date ? params.date : bill.date;
    bill.type_id = params.type_id ? params.type_id : bill.type_id;
    bill.type_name = params.type_name ? params.type_name : bill.type_name;
    bill.pay_type = params.pay_type ? params.pay_type : bill.pay_type;
    bill.remark = params.remark ? params.remark : bill.remark;
    return await this.billRepository.save(bill);
  }

  async deleteBill(id: number, user_id: number) {
    const result = await this.billRepository.delete({
      id: id,
      user_id: user_id,
    });
    console.log(result);
    return result;
  }
}
