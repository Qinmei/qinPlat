import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

type ReceiveData = [number, number];

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  directory: string;

  @Column()
  hash: string;

  @Column()
  uuid: string;

  @Column()
  size: number;

  @Column()
  receive: ReceiveData[];

  @Column()
  status: string;

  @UpdateDateColumn()
  updatedAt: number;

  @CreateDateColumn()
  createdAt: number;
}
