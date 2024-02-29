import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Applicant } from './entities/applicant.entity';
import { Repository } from 'typeorm';
import { OdooService } from 'src/odoo/odoo.service';
import { Resume } from './entities/resume.entity';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JobVacanyService } from 'src/job-vacany/job-vacany.service';
import { RegisterApplicantDto } from './dto/register-applicant.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApplicantService implements OnModuleInit {
  constructor(
    @InjectRepository(Applicant)
    private applicantRepository: Repository<Applicant>,
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    private readonly httpService: HttpService,
    private readonly odooService: OdooService,
    private readonly jobVacancyService: JobVacanyService,
  ) {}

  //runs with startup of the application and creates admin details in database (seeding database)
  async onModuleInit() {
    await this.register({
      firstName: 'test',
      lastName: 'man',
      userName: 'test',
      password: 'test',
      phoneNumber: '123456',
      email: 'test@test.com',
    });
  }

  async create(
    createApplicantDto: CreateApplicantDto,
    resumeFile: Express.Multer.File,
  ) {
    const {
      firstName,
      lastName,
      education,
      phoneNumber,
      email,
      language,
      experience,
      jobVacancyId,
    } = createApplicantDto;

    const jobVacancy = await this.jobVacancyService.findOne(
      parseInt(jobVacancyId),
    );

    const job_keywords = {};
    jobVacancy.skills.forEach((x) => {
      job_keywords[x.title] = x.weight;
    });

    const filePath = join(process.cwd(), 'uploads', resumeFile.filename);
    const formData = new FormData();
    const file = createReadStream(filePath);
    formData.append('file', file);

    // Call parse endpoint
    const { data: resumeData } = await this.httpService.axiosRef.post(
      'http://127.0.0.1:8000/parse-resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    // call the similarity endpoint
    const { data: similarityData } = await this.httpService.axiosRef.post(
      'http://127.0.0.1:8000/rank-resume',
      {
        job_keywords,
        resume_keywords: resumeData?.extracted_keywords,
      },
    );

    const rating = Math.round((similarityData.percantage * 5) / 100).toString();

    const newResume = this.resumeRepository.create({
      filename: resumeFile.filename,
      education,
      language,
      experience,
      rating,
      extracted_keywords: '',
      resume_data: '',
      jobVacancy,
    });

    await this.resumeRepository.save(newResume);

    // Store applicant in Odoo
    const odooResult = await this.odooService.createApplicant({
      firstName,
      lastName,
      rating,
      resumeData: resumeData?.resume_data,
      job_id: jobVacancy.odooJobId.toString(),
    });

    const newApplicant = this.applicantRepository.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      resumes: [newResume],
      odooApplicantId: odooResult as number,
    });

    console.log({ odooResult });

    await this.applicantRepository.save(newApplicant);

    return 'This action adds a new applicant';
  }

  async register(registerApplicantDto: RegisterApplicantDto) {
    const userExists = await this.findOneByUsername(
      registerApplicantDto.userName,
    );
    if (userExists) {
      return null;
    }
    const saltRounds = 10;
    const password = await bcrypt.hash(
      registerApplicantDto.password,
      saltRounds,
    );
    const user = this.applicantRepository.create({
      ...registerApplicantDto,
      password,
    });
    return await this.applicantRepository.save(user);
  }

  async findAll() {
    return await this.applicantRepository.find();
  }
  async findOneByUsername(userName: string) {
    return await this.applicantRepository.findOne({ where: { userName } });
  }
  async findOne(id: number) {
    return `This action returns a #${id} applicant`;
  }

  async update(id: number, updateApplicantDto: UpdateApplicantDto) {
    const applicant = await this.findOne(id);

    if (!applicant) {
      throw new NotFoundException(`Applicant with ID ${id} not found`);
    }

    return this.applicantRepository.save({ id, ...updateApplicantDto });
  }

  async remove(id: number) {
    return await this.applicantRepository.delete({ id });
  }
}
