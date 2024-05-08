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
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthApplicantGuard } from 'src/auth/auth guard/auth-applicant.guard';
import { AuthAllGuard } from 'src/auth/auth guard/auth-all.guard';
import { join } from 'path';
import { createReadStream } from 'fs';

//@UseGuards(AuthAllGuard)
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
  @Get('/uploads/:filename')
  getResume(@Param('filename') filename: string) {
    const file = createReadStream(join(process.cwd(), 'uploads', filename));
    return new StreamableFile(file);
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
