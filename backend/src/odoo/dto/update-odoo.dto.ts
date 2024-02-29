import { PartialType } from '@nestjs/mapped-types';
import { CreateOdooDto } from './create-odoo.dto';

export class UpdateOdooDto extends PartialType(CreateOdooDto) {}
