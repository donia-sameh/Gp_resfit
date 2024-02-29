import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: null })
  phoneNumber: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  userName: string;

  @Column({ default: null })
  password: string;

  @Column({ default: null })
  odooApplicantId?: number;

  @OneToMany(() => Resume, (resume) => resume.applicant)
  resumes: Resume[];
}
