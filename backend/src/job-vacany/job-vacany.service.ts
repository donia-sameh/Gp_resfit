import { Injectable } from '@nestjs/common';
import { CreateJobVacanyDto } from './dto/create-job-vacany.dto';
import { UpdateJobVacanyDto } from './dto/update-job-vacany.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobVacany } from './entities/job-vacany.entity';
import { Repository } from 'typeorm';
import { JobVacanyTechSkill } from './entities/job-vacany-tech-skill.entity';
import { OdooService } from 'src/odoo/odoo.service';
import { JobVacanyScreeningQuestions } from './entities/job-vacancy-screening-question.entity';
import { ScreeningQuestion } from 'src/settings/entities/screening-question.entity';

@Injectable()
export class JobVacanyService {
  constructor(
    @InjectRepository(JobVacany)
    private jobVacancyRepository: Repository<JobVacany>,
    @InjectRepository(JobVacanyTechSkill)
    private jobVacancyTechSkillRepository: Repository<JobVacanyTechSkill>,
    @InjectRepository(ScreeningQuestion)
    private screeningQuestionRepository: Repository<ScreeningQuestion>,
    @InjectRepository(JobVacanyScreeningQuestions)
    private jobVacancyScreeningQuestionsRepository: Repository<JobVacanyScreeningQuestions>,
    private readonly odooService: OdooService,
  ) {}
  async create(createJobVacancyDto: CreateJobVacanyDto) {
    const { skills, screeningQuestions, description, ...rest } =
      createJobVacancyDto;
    // Add to odoo
    const odooJobId = (await this.odooService.createJobOpening(
      createJobVacancyDto,
    )) as number;
    const newJobVacancy = this.jobVacancyRepository.create({
      ...rest,
      jobDescription: description,
      odooJobId,
    });
    await this.jobVacancyRepository.save(newJobVacancy);

    // Add skills
    skills.forEach(async (skill) => {
      const newSkill = this.jobVacancyTechSkillRepository.create({
        job_vacancy: newJobVacancy,
        ...skill,
      });
      await this.jobVacancyTechSkillRepository.save(newSkill);
    });

    // Add screening questions
    screeningQuestions.forEach(async (id) => {
      const screeningQuestion = await this.screeningQuestionRepository.findOne({
        where: { id },
      });
      const newQuestion = this.jobVacancyScreeningQuestionsRepository.create({
        job_vacancy: newJobVacancy,
        screening_question: screeningQuestion,
      });
      await this.jobVacancyScreeningQuestionsRepository.save(newQuestion);
    });
  }

  async findAll() {
    return await this.jobVacancyRepository.find();
  }

  async findOne(id: number) {
    const { job_vacancy_screening_questions, job_vacancy_tech_skill, ...rest } =
      await this.jobVacancyRepository.findOne({
        where: { id },
        relations: [
          'job_vacancy_tech_skill',
          'job_vacancy_screening_questions',
          'job_vacancy_screening_questions.screening_question',
        ],
      });

    return {
      ...rest,
      skills: job_vacancy_tech_skill,
      screeningQuestions: job_vacancy_screening_questions,
    };
  }

  async update(id: number, updateJobVacanyDto: UpdateJobVacanyDto) {
    const {
      skills,
      screeningQuestions,
      description: jobDescription,
      ...updatedDetails
    } = updateJobVacanyDto;
    const jobVacancy = await this.jobVacancyRepository.findOne({
      where: { id },
      relations: [
        'job_vacancy_tech_skill',
        'job_vacancy_screening_questions',
        'job_vacancy_screening_questions.screening_question',
      ],
    });

    // Remove all current tech skills
    await Promise.all(
      jobVacancy.job_vacancy_tech_skill.map(async ({ id }) => {
        await this.jobVacancyTechSkillRepository.delete(id);
      }),
    );

    // Add new ones
    skills.forEach(async (skill) => {
      const newSkill = this.jobVacancyTechSkillRepository.create({
        job_vacancy: jobVacancy,
        ...skill,
      });
      await this.jobVacancyTechSkillRepository.save(newSkill);
    });

    // Remove all current screening questions
    await Promise.all(
      jobVacancy.job_vacancy_screening_questions.map(async ({ id }) => {
        await this.jobVacancyScreeningQuestionsRepository.delete(id);
      }),
    );

    screeningQuestions.forEach(async (id) => {
      const screeningQuestion = await this.screeningQuestionRepository.findOne({
        where: { id },
      });
      const newQuestion = this.jobVacancyScreeningQuestionsRepository.create({
        job_vacancy: jobVacancy,
        screening_question: screeningQuestion,
      });
      await this.jobVacancyScreeningQuestionsRepository.save(newQuestion);
    });

    return await this.jobVacancyRepository.update(id, {
      ...updatedDetails,
      jobDescription,
    });
  }

  async remove(id: number) {
    // Find the job vacancy with related entities
    const jobVacancy = await this.jobVacancyRepository.findOne({
      where: { id },
      relations: ['job_vacancy_tech_skill', 'job_vacancy_screening_questions'],
    });

    if (!jobVacancy) {
      // Handle case where job vacancy is not found
      return null;
    }

    // Remove related tech skills
    await this.jobVacancyTechSkillRepository.remove(
      jobVacancy.job_vacancy_tech_skill,
    );

    // Remove related screening questions
    await this.jobVacancyScreeningQuestionsRepository.remove(
      jobVacancy.job_vacancy_screening_questions,
    );

    // Finally, remove the job vacancy itself
    return await this.jobVacancyRepository.remove(jobVacancy);
  }

  async getApplicantsByJobVacancyId(id: number) {
    const jobVacancy = await this.jobVacancyRepository.findOne({
      where: { id },
      relations: ['resumes', 'resumes.applicant'], // This loads both resumes and their related applicants
    });

    if (jobVacancy?.resumes) {
      return jobVacancy.resumes
        .filter((resume) => resume.applicant)
        .map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ({ applicant: { password, ...rest }, rating }) => ({
            ...rest,
            rating,
          }),
        );
    }

    return [];
  }

  async getApplicantByJobVacancyId(id: number, userName: string) {
    const jobVacancy = await this.jobVacancyRepository.findOne({
      where: { id },
      relations: ['resumes', 'resumes.applicant'], // This loads both resumes and their related applicants
    });

    if (jobVacancy?.resumes) {
      return jobVacancy.resumes.find((a) => a.applicant?.userName === userName);
    }

    return {};
  }

  async getTechSkillByJobVacancyId(id: number) {
    const jobVacancy = await this.jobVacancyRepository.findOne({
      where: { id },
      relations: ['job_vacancy_tech_skill'],
    });
    if (jobVacancy && jobVacancy.job_vacancy_tech_skill) {
      return jobVacancy.job_vacancy_tech_skill.map((techSkillEntity) => {
        return {
          id: techSkillEntity.id,
          title: techSkillEntity.title,
          weight: techSkillEntity.weight,
        };
      });
    }

    return [];
  }

  async getScreeningQuestionByJobVacancyId(id: number) {
    // Find the job vacancy by id, including its related screening questions
    const jobVacancy = await this.jobVacancyRepository.findOne({
      where: { id },
      relations: [
        'job_vacancy_screening_questions',
        'job_vacancy_screening_questions.screening_question',
      ],
    });

    // Check if the job vacancy and its screening questions were found
    if (jobVacancy && jobVacancy.job_vacancy_screening_questions) {
      // Map through the screening questions to return the desired information
      return jobVacancy.job_vacancy_screening_questions.map((sq) => {
        const { screening_question } = sq;
        return {
          id: screening_question.id, // Assuming the screening question entity has an 'id'
          question: screening_question.question,
          key_answer: screening_question.key_answer, // Assuming the screening question entity has a 'question' field
          // Include more properties as needed
        };
      });
    }

    return []; // Return an empty array if no job vacancy or screening questions found
  }
}
