import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ScreeningQuestion } from 'src/settings/entities/screening-question.entity';
import { JobVacany } from './job-vacany.entity';

@Entity()
export class JobVacanyScreeningQuestions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ScreeningQuestion,
    (d) => d.job_vacancy_screening_questions,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  screening_question: ScreeningQuestion;

  @ManyToOne(() => JobVacany, (d) => d.job_vacancy_screening_questions)
  job_vacancy: JobVacany;
}
