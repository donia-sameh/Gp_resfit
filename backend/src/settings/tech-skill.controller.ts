import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateTechSkillDto } from './dto/create-tech-skill.dto';
import { TechSkillService } from './tech-skill.service';
import { AuthAdminGuard } from 'src/auth/auth guard/auth-admin.guard';
import { AuthAllGuard } from 'src/auth/auth guard/auth-all.guard';
import { UpdateTechSkillDto } from './dto/update-tech-skill.dto';

@Controller('tech-skill')
export class TechSkillController {
  constructor(private readonly techSkillService: TechSkillService) {}

  @UseGuards(AuthAdminGuard)
  @Post()
  create(@Body() createTechSkillDto: CreateTechSkillDto) {
    return this.techSkillService.create(createTechSkillDto);
  }
  @UseGuards(AuthAllGuard)
  @Get()
  findAll() {
    return this.techSkillService.findAll();
  }
  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techSkillService.remove(+id);
  }

  @UseGuards(AuthAdminGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTechSkillDto: UpdateTechSkillDto,
  ) {
    return this.techSkillService.update(+id, updateTechSkillDto);
  }
}
