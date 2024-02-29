import { Injectable } from '@nestjs/common';
import OdooConnector from './odoo-connector';
import { CreateJobVacanyDto } from 'src/job-vacany/dto/create-job-vacany.dto';
import { CreateTechSkillDto } from 'src/settings/dto/create-tech-skill.dto';
import { CreateApplicantDto } from 'src/applicant/dto/create-applicant.dto';
import { CreateApplicantOdooDto } from 'src/applicant/dto/create-applicant-odoo.dto';

@Injectable()
export class OdooService {
  odooConnector: OdooConnector;
  constructor() {
    this.odooConnector = new OdooConnector({
      url: 'http://localhost',
      port: 8069,
      db: 'odoo-resufit',
      username: 'donia2004436@miuegypt.edu.eg',
      password: 'admin',
    });
  }

  async getEmployees() {
    const inParams = [
      [], // domain
      [
        '__last_update',
        'activity_exception_decoration',
        'activity_exception_icon',
        'activity_state',
        'activity_summary',
        'activity_type_icon',
        'activity_type_id',
        'id',
        'hr_presence_state',
        'user_id',
        'user_partner_id',
        'hr_icon_display',
        'show_hr_icon_display',
        'image_128',
        'image_1024',
        'name',
        'job_title',
        'category_ids',
        'work_email',
        'work_phone',
        'activity_ids',
      ],
    ];
    const params = [inParams];
    await this.odooConnector.connect();
    const hrData = await this.odooConnector.execute_kw(
      'hr.employee',
      //retrieve record
      'search_read',
      params,
    );
    console.log(hrData);
    return hrData;
  }

  async getJobOpenings() {
    const inParams = [
      [], // domain
      [],
    ];
    const params = [inParams];
    await this.odooConnector.connect();
    const hrData = await this.odooConnector.execute_kw(
      'hr.job',
      'search_read',
      params,
    );
    console.log(hrData);
    return hrData;
  }

  async createJobOpening(createJobDto: CreateJobVacanyDto) {
    const { title, description } = createJobDto;
    const params = [
      [
        {
          name: title,
          //department_id: department_id, // Replace with actual department ID
          description: description,
          no_of_recruitment: 1,
          // Other fields as needed (refer to Odoo documentation)
        },
      ],
      [],
    ];
    await this.odooConnector.connect();
    const result = await this.odooConnector.execute_kw(
      'hr.job',
      'create',
      params,
    );
    return result;
  }
  async createTechSkill({ title }: CreateTechSkillDto) {
    const params = [
      [
        {
          name: title,
        },
      ],
      [],
    ];
    await this.odooConnector.connect();
    const result = await this.odooConnector.execute_kw(
      'hr.skill.type',
      'create',
      params,
    );
    console.log(result);
    return result;
  }

  async createApplicant({
    firstName,
    lastName,
    rating,
    resumeData,
    job_id,
  }: CreateApplicantOdooDto) {
    const params = [
      [
        {
          name: `${firstName} ${lastName}`,
          description: resumeData,
          x_rating: rating,
          job_id,
        },
      ],
      [],
    ];
    await this.odooConnector.connect();
    const result = await this.odooConnector.execute_kw(
      'hr.applicant',
      'create',
      params,
    );
    console.log(result);
    return result;
  }
}
