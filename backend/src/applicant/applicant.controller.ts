import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthApplicantGuard } from 'src/auth/auth guard/auth-applicant.guard';

@UseGuards(AuthApplicantGuard)
@Controller('applicant')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post()
  @UseInterceptors(FileInterceptor('resumeFile'))
  create(
    @Body() createApplicantDto: CreateApplicantDto,
    @UploadedFile() resumeFile: Express.Multer.File,
    @Request() req,
  ) {
    if (req.user) {
      createApplicantDto.userName = req.user.userName;
    }
    return this.applicantService.create(createApplicantDto, resumeFile);
  }

  @Get()
  findAll() {
    return this.applicantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicantDto: UpdateApplicantDto,
  ) {
    return this.applicantService.update(+id, updateApplicantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicantService.remove(+id);
  }

  @Get('/resume/:jobVacancyId')
  getResumeByJobVacancy(
    @Param('jobVacancyId') jobVacancyId: number,
    @Request() req,
  ) {
    return this.applicantService.getResumeForJobVacancy({
      jobVacancyId,
      userName: req.user?.userName,
    });
  }
}
