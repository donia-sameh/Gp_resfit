import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from './entities/resume.entity';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume) private resumeRepository: Repository<Resume>,
  ) {}
  async findOne(id: number) {
    return await this.resumeRepository.findOne({ where: { id } ,  relations: ['resumeScreeningQuestionsAnswers']});
  }
}
