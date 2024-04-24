import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class ResumeScreeningQuestionsAnswers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @ManyToOne(() => Resume, (d) => d.resumeScreeningQuestionsAnswers)
  resume: Resume;
}
