import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JobVacanyService } from './job-vacany.service';
import { CreateJobVacanyDto } from './dto/create-job-vacany.dto';
import { UpdateJobVacanyDto } from './dto/update-job-vacany.dto';
import { AuthAdminGuard } from 'src/auth/auth guard/auth-admin.guard';
import { AuthAllGuard } from 'src/auth/auth guard/auth-all.guard';

@Controller('job-vacany')
export class JobVacanyController {
  constructor(private readonly jobVacanyService: JobVacanyService) {}

  @UseGuards(AuthAdminGuard)
  @Post()
  create(@Body() createJobVacanyDto: CreateJobVacanyDto) {
    return this.jobVacanyService.create(createJobVacanyDto);
  }

  @UseGuards(AuthAllGuard)
  @Get()
  findAll() {
    return this.jobVacanyService.findAll();
  }
  @UseGuards(AuthAllGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobVacanyService.findOne(+id);
  }
  @UseGuards(AuthAdminGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobVacanyDto: UpdateJobVacanyDto,
  ) {
    return this.jobVacanyService.update(+id, updateJobVacanyDto);
  }
  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobVacanyService.remove(+id);
  }

  @UseGuards(AuthAllGuard)
  @Get('/applicants/:id')
  getApplicantsByJobVacancyId(@Param('id') id: string) {
    return this.jobVacanyService.getApplicantsByJobVacancyId(+id);
  }
  @UseGuards(AuthAllGuard)
  @Get('/tech-skill/:id')
  getTechSkillByJobVacancyId(@Param('id') id: string) {
    return this.jobVacanyService.getTechSkillByJobVacancyId(+id);
  }
  @UseGuards(AuthAllGuard)
  @Get('/screening-questions/:id')
  getScreeningQuestionByJobVacancyId(@Param('id') id: string) {
    return this.jobVacanyService.getScreeningQuestionByJobVacancyId(+id);
  }
}
