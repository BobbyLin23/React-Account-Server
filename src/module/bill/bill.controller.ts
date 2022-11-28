import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillService } from './bill.service';
import * as moment from 'moment';

@Controller('bill')
export class BillController {
  constructor(
    private readonly authService: AuthService,
    private billService: BillService,
  ) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async add(@Req() request: Request, @Res() response: Response) {
    const {
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark = '',
    } = request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      response.send({
        code: 400,
        msg: 'params error',
        data: null,
      });
    }
    const token = request.headers.authorization;
    const decode = await this.authService.verifyToken(token);
    const result = await this.billService.addBill(decode.sub, {
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark,
    });
    return response.send({
      code: 200,
      msg: '',
      data: {
        result,
      },
    });
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(@Req() request: Request, @Res() response: Response) {
    const { date, page = 1, page_size = 5, type_id = 0 } = request.query;
    const token = request.headers.authorization;
    const decode = await this.authService.verifyToken(token);
    const list = await this.billService.getList(decode.sub);
    const _list = list.filter((item) => {
      if (Number(type_id) !== 0) {
        return (
          moment(Number(item.date)).format('YYYY-MM') === date &&
          Number(type_id) == item.type_id
        );
      }
      return moment(Number(item.date)).format('YYYY-MM') === date;
    });
    let listMap = _list
      .reduce((curr, item) => {
        const date = moment(Number(item.date)).format('YYYY-MM-DD');
        if (
          curr &&
          curr.length &&
          curr.findIndex((item) => item.date === date) > -1
        ) {
          const index = curr.findIndex((item) => item.date === date);
          curr[index].bills.push(item);
        }
        if (
          curr &&
          curr.length &&
          curr.findIndex((item) => item.date === date) === -1
        ) {
          curr.push({ date, bills: [item] });
        }
        if (!curr.length) {
          curr.push({
            date,
            bills: [item],
          });
        }
        return curr;
      }, [])
      .sort((a, b) => Number(b.date) - Number(a.date));
    const filterListMap = listMap.slice(
      (Number(page) - 1) * Number(page_size),
      Number(page) * Number(page_size),
    );
    let __list = list.filter(
      (item) => moment(Number(item.date)).format('YYYY-MM') == date,
    );
    let totalExpense = __list.reduce((curr, item) => {
      if (item.pay_type == 1) {
        curr += Number(item.amount);
        return curr;
      }
      return curr;
    }, 0);
    let totalIncome = __list.reduce((curr, item) => {
      if (item.pay_type == 2) {
        curr += Number(item.amount);
        return curr;
      }
      return curr;
    }, 0);
    return response.send({
      code: 200,
      msg: '',
      data: {
        totalExpense,
        totalIncome,
        totalPage: Math.ceil(listMap.length / Number(page_size)),
        list: filterListMap || [],
      },
    });
  }

  @Get('detail')
  @UseGuards(JwtAuthGuard)
  async detail(@Req() request: Request, @Res() response: Response) {
    const { id = '' } = request.query;
    if (!id) {
      return response.send({
        code: 500,
        msg: "Order Id can't be null",
        data: null,
      });
    }
    const token = request.headers.authorization;
    const decode = await this.authService.verifyToken(token);
    let user_id = decode.sub;
    const detail = await this.billService.getDetail(Number(id), user_id);
    if (detail) {
      return response.send({
        code: 200,
        msg: 'Success',
        data: { detail },
      });
    } else {
      return response.send({
        code: 500,
        msg: 'Error',
        data: null,
      });
    }
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async update(@Req() request: Request, @Res() response: Response) {
    const {
      id,
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark = '',
    } = request.body;
    if (!amount && !type_id && !type_name && !date && !pay_type) {
      return response.send({
        code: 400,
        msg: 'Error',
        data: null,
      });
    }
    const token = request.headers.authorization;
    const decode = await this.authService.verifyToken(token);
    const user_id = decode.sub;
    const result = await this.billService.updateBill({
      id,
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark,
      user_id,
    });
    if (result) {
      return response.send({ code: 200, msg: 'success', data: result });
    } else {
      return response.send({ code: 500, msg: 'error', data: null });
    }
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async delete(@Req() request: Request, @Res() response: Response) {
    const { id } = request.body;
    if (!id) {
      return response.send({ code: 400, msg: 'error', data: null });
    }
    const token = request.headers.authorization;
    const decode = await this.authService.verifyToken(token);
    const user_id = decode.sub;
    const result = await this.billService.deleteBill(id, user_id);
    if (result) {
      return response.send({
        code: 200,
        msg: 'code',
        data: null,
      });
    } else {
      return response.send({
        code: 200,
        msg: 'error',
        data: null,
      });
    }
  }

  @Get('data')
  @UseGuards(JwtAuthGuard)
  async data(@Req() request: Request, @Res() response: Response) {
    const { date = '' } = request.query;
    const token = request.headers.authorization;
    const decode = await this.authService.verifyToken(token);

    let user_id = decode.sub;
    if (!date) {
      return response.send({
        code: 400,
        msg: 'error',
        data: null,
      });
    }
    const result = await this.billService.getList(user_id);
    const start =
      moment(date as string)
        .startOf('month')
        .unix() * 1000;
    const end =
      moment(date as string)
        .endOf('month')
        .unix() * 1000;
    const _data = result.filter((item) => {
      if (Number(item.date) > start && Number(item.date) < end) {
        return item;
      }
    });
    const totalExpense = _data.reduce((arr, curr) => {
      if (Number(curr.pay_type) === 1) {
        arr += Number(curr.amount);
      }
      return arr;
    }, 0);
    const totalIncome = _data.reduce((arr, curr) => {
      if (Number(curr.pay_type) === 2) {
        arr += Number(curr.amount);
      }
      return arr;
    }, 0);
    let totalData = _data.reduce((arr, curr) => {
      const index = arr.findIndex((item) => item.type_id === curr.type_id);
      if (index === -1) {
        arr.push({
          type_id: curr.type_id,
          type_name: curr.type_name,
          pay_type: curr.pay_type,
          number: Number(curr.amount),
        });
      }
      if (index > -1) {
        arr[index].number += Number(curr.amount);
      }
      return arr;
    }, []);
    totalData = totalData.map((item) => {
      item.number = Number(Number(item.number).toFixed(2));
      return item;
    });
    return response.send({
      code: 200,
      msg: 'success',
      data: {
        total_expense: Number(totalExpense).toFixed(2),
        total_income: Number(totalIncome).toFixed(2),
        total_data: totalData || {},
      },
    });
  }
}
