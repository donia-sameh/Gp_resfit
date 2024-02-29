import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobVacany } from './job-vacany.entity';

@Entity()
export class JobVacanyTechSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  weight: number;

  @ManyToOne(() => JobVacany, (d) => d.job_vacancy_tech_skill)
  job_vacancy: JobVacany;
}
