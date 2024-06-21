import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Applicant } from './applicant.entity';
import { JobVacany } from 'src/job-vacany/entities/job-vacany.entity';
import { ResumeScreeningQuestionsAnswers } from './resume-screening-questions-answers.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  education: string;

  @Column()
  language: string;

  @Column()
  yearsOfExperience: string;

  // final rating
  @Column()
  rating: string;

  @Column()
  resume_rating: string;

  @Column()
  screening_questions_rating: string;

  @Column({ type: 'text', default: null })
  extracted_keywords: string;

  @Column({ type: 'text', default: null })
  resume_data: string;

  @Column()
  filename: string;

  @Column({ type: 'text', default: null })
  resume_feedback_conclusion: string;

  @Column({ type: 'text', default: null })
  resume_feedback_needsToImprove: string;

  @Column({ default: null })
  odooApplicantId?: number;

  @ManyToOne(() => Applicant, (d) => d.resumes)
  applicant: Applicant;

  @ManyToOne(() => JobVacany, (d) => d.resumes)
  jobVacancy: JobVacany;

  @OneToMany(() => ResumeScreeningQuestionsAnswers, (q) => q.resume, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  resumeScreeningQuestionsAnswers: ResumeScreeningQuestionsAnswers[];
}
