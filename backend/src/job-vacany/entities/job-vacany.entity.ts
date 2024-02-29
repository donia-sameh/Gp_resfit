import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JobVacanyTechSkill } from './job-vacany-tech-skill.entity';
import { Resume } from 'src/applicant/entities/resume.entity';
import { JobVacanyScreeningQuestions } from './job-vacancy-screening-question.entity';

@Entity()
export class JobVacany {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: null })
  education: string;

  @Column()
  yearsOfExperience: string;

  @Column({ type: 'text', default: null })
  jobDescription: string;

  @Column()
  odooJobId: number;

  @OneToMany(() => JobVacanyTechSkill, (d) => d.job_vacancy, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  job_vacancy_tech_skill: JobVacanyTechSkill[];

  @OneToMany(() => JobVacanyScreeningQuestions, (d) => d.job_vacancy, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  job_vacancy_screening_questions: JobVacanyScreeningQuestions[];

  @OneToMany(() => Resume, (resume) => resume.jobVacancy, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  resumes: Resume[];
}
