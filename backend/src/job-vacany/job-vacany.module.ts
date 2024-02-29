import { Module, forwardRef } from '@nestjs/common';
import { JobVacanyService } from './job-vacany.service';
import { JobVacanyController } from './job-vacany.controller';
import { JobVacanyTechSkill } from './entities/job-vacany-tech-skill.entity';
import { JobVacany } from './entities/job-vacany.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobVacanyScreeningQuestions } from './entities/job-vacancy-screening-question.entity';
import { OdooModule } from 'src/odoo/odoo.module';
import { AdminModule } from 'src/admin/admin.module';
import { ApplicantModule } from 'src/applicant/applicant.module';
import { ScreeningQuestionsService } from './screening-questions.service';
import { ScreeningQuestion } from 'src/settings/entities/screening-question.entity';
import { ScreeningQuestionsController } from './screening-questions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScreeningQuestion,
      JobVacanyTechSkill,
      JobVacany,
      JobVacanyScreeningQuestions,
    ]),
    OdooModule,
    AdminModule,
    forwardRef(() => ApplicantModule),
  ],
  exports: [TypeOrmModule, JobVacanyService],
  controllers: [JobVacanyController, ScreeningQuestionsController],
  providers: [JobVacanyService, ScreeningQuestionsService],
})
export class JobVacanyModule {}
