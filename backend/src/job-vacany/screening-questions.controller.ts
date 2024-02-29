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
import { ScreeningQuestionsService } from './screening-questions.service';
import { AuthAdminGuard } from 'src/auth/auth guard/auth-admin.guard';
import { AuthAllGuard } from 'src/auth/auth guard/auth-all.guard';
import { CreateScreeningQuestionDto } from './dto/create-screening-question.dto';
import { UpdateScreeningQuestionDto } from './dto/update-screening-question.dto';

@Controller('screening-questions')
export class ScreeningQuestionsController {
  constructor(
    private readonly screeningQuestionsService: ScreeningQuestionsService,
  ) {}

  @UseGuards(AuthAdminGuard)
  @Post()
  create(@Body() createScreeningQuestionDto: CreateScreeningQuestionDto) {
    return this.screeningQuestionsService.create(createScreeningQuestionDto);
  }

  @UseGuards(AuthAllGuard)
  @Get()
  findAll() {
    return this.screeningQuestionsService.findAll();
  }
  @UseGuards(AuthAllGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screeningQuestionsService.findOne(+id);
  }
  @UseGuards(AuthAdminGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateScreeningQuestionDto: UpdateScreeningQuestionDto,
  ) {
    return this.screeningQuestionsService.update(
      +id,
      updateScreeningQuestionDto,
    );
  }
  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screeningQuestionsService.remove(+id);
  }
}
