import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScreeningQuestion } from 'src/settings/entities/screening-question.entity';
import { Repository } from 'typeorm';
import { CreateScreeningQuestionDto } from './dto/create-screening-question.dto';
import { UpdateScreeningQuestionDto } from './dto/update-screening-question.dto';

@Injectable()
export class ScreeningQuestionsService {
  constructor(
    @InjectRepository(ScreeningQuestion)
    private screeningQuestionsRepository: Repository<ScreeningQuestion>,
  ) {}

  async findAll() {
    return await this.screeningQuestionsRepository.find();
  }

  async findOne(id: number) {
    return await this.screeningQuestionsRepository.findOne({
      where: { id },
    });
  }

  async create(createScreeningQuestionDto: CreateScreeningQuestionDto) {
    const newItem = await this.screeningQuestionsRepository.create({
      ...createScreeningQuestionDto,
    });

    return await this.screeningQuestionsRepository.save(newItem);
  }

  async update(
    id: number,
    updateScreeningQuestionDto: UpdateScreeningQuestionDto,
  ) {
    await this.findOne(id);

    return this.screeningQuestionsRepository.save({
      id,
      ...updateScreeningQuestionDto,
    });
  }

  async remove(id: number) {
    return await this.screeningQuestionsRepository.delete({ id });
  }
}
