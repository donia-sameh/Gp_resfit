import { PartialType } from '@nestjs/mapped-types';
import { CreateScreeningQuestionDto } from './create-screening-question.dto';

export class UpdateScreeningQuestionDto extends PartialType(
  CreateScreeningQuestionDto,
) {}
