import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TechSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
