import { Test, TestingModule } from '@nestjs/testing';
import { JobVacanyService } from './job-vacany.service';

describe('JobVacanyService', () => {
  let service: JobVacanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobVacanyService],
    }).compile();

    service = module.get<JobVacanyService>(JobVacanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
