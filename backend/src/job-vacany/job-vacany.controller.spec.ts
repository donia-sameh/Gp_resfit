import { Test, TestingModule } from '@nestjs/testing';
import { JobVacanyController } from './job-vacany.controller';
import { JobVacanyService } from './job-vacany.service';

describe('JobVacanyController', () => {
  let controller: JobVacanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobVacanyController],
      providers: [JobVacanyService],
    }).compile();

    controller = module.get<JobVacanyController>(JobVacanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
