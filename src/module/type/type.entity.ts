import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('types')
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: number;
}
