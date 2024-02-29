import { PartialType } from '@nestjs/mapped-types';
import { CreateJobVacanyDto } from './create-job-vacany.dto';

export class UpdateJobVacanyDto extends PartialType(CreateJobVacanyDto) {}
