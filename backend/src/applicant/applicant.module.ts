import { Module } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantController } from './applicant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from './entities/applicant.entity';
import { Resume } from './entities/resume.entity';
import { ResumeController } from './resume.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HttpModule } from '@nestjs/axios';
import { OdooModule } from 'src/odoo/odoo.module';
import { JobVacanyModule } from 'src/job-vacany/job-vacany.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Applicant, Resume]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Specify destination folder
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${file.originalname}`); // Generate unique filename
        },
      }),
    }),
    HttpModule,
    OdooModule,
    JobVacanyModule,
  ],
  exports: [TypeOrmModule, ApplicantService],
  controllers: [ApplicantController, ResumeController],
  providers: [ApplicantService],
})
export class ApplicantModule {}
