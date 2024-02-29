import { PartialType } from '@nestjs/mapped-types';
import { CreateTechSkillDto } from './create-tech-skill.dto';

export class UpdateTechSkillDto extends PartialType(CreateTechSkillDto) {}
