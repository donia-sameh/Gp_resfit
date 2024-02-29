import { Injectable } from '@nestjs/common';
import { TechSkill } from './entities/tech-skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTechSkillDto } from './dto/create-tech-skill.dto';
import { OdooService } from 'src/odoo/odoo.service';
import { UpdateTechSkillDto } from './dto/update-tech-skill.dto';

@Injectable()
export class TechSkillService {
  constructor(
    @InjectRepository(TechSkill)
    private TechSkillRepository: Repository<TechSkill>,
    private readonly odooService: OdooService,
  ) {}
  async create({ title }: CreateTechSkillDto) {
    const newTechSkill = this.TechSkillRepository.create({
      title,
    });
    await this.TechSkillRepository.save(newTechSkill);
    // Add to odoo
    await this.odooService.createTechSkill({ title });
  }
  async findAll() {
    return await this.TechSkillRepository.find();
  }
  async findOne(id: number) {
    return await this.TechSkillRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateTechSkillDto: UpdateTechSkillDto) {
    await this.findOne(id);

    return this.TechSkillRepository.save({ id, ...updateTechSkillDto });
  }

  async remove(id: number) {
    return await this.TechSkillRepository.delete({ id });
  }
}
