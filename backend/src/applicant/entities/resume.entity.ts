import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Applicant } from './applicant.entity';
import { JobVacany } from 'src/job-vacany/entities/job-vacany.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  education: string;

  @Column()
  language: string;

  @Column()
  experience: string;

  @Column()
  rating: string;

  @Column({ type: 'text', default: null })
  extracted_keywords: string;

  @Column({ type: 'text', default: null })
  resume_data: string;

  @Column()
  filename: string;

  @ManyToOne(() => Applicant, (d) => d.resumes)
  applicant: Applicant;

  @ManyToOne(() => JobVacany, (d) => d.resumes)
  jobVacancy: JobVacany;
}
