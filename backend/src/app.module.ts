import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicantModule } from './applicant/applicant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';
import { JobVacanyModule } from './job-vacany/job-vacany.module';
import { OdooModule } from './odoo/odoo.module';
import { TechSkillService } from './settings/tech-skill.service';
import { AuthModule } from './auth/auth.module';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApplicantModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ats_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AdminModule,
    SettingsModule,
    JobVacanyModule,
    OdooModule,
    AuthModule,
    ChatgptModule,
  ],
  controllers: [AppController],
  providers: [AppService, TechSkillService],
})
export class AppModule {}
