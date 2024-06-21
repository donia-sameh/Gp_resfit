import { Controller, Get, Param } from '@nestjs/common';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
    constructor(private readonly resumeService: ResumeService) {}
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.resumeService.findOne(+id);
    }
}
