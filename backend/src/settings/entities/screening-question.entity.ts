import { JobVacanyScreeningQuestions } from 'src/job-vacany/entities/job-vacancy-screening-question.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class ScreeningQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', default: null })
  question: string;

  @Column({ type: 'text', default: null })
  key_answer: string;

  @OneToMany(() => JobVacanyScreeningQuestions, (d) => d.screening_question)
  job_vacancy_screening_questions: JobVacanyScreeningQuestions[];
}
