import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OdooService } from './odoo.service';
import { CreateOdooDto } from './dto/create-odoo.dto';
import { UpdateOdooDto } from './dto/update-odoo.dto';

@Controller('odoo')
export class OdooController {
  constructor(private readonly odooService: OdooService) {}

  @Get('employees')
  getEmployees() {
    return this.odooService.getEmployees();
  }
  @Get('job-openings')
  getJobOpenings() {
    return this.odooService.getJobOpenings();
  }
}
