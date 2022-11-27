import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pay_type: number;

  @Column()
  amount: string;

  @Column()
  date: string;

  @Column()
  type_id: number;

  @Column()
  type_name: string;

  @Column({ nullable: true })
  remark: string;

  @Column()
  user_id: number;
}
