import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterApplicantDto } from 'src/applicant/dto/register-applicant.dto';
import { AuthAllGuard } from './auth guard/auth-all.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  registerApplicant(@Body() registerDto: RegisterApplicantDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthAllGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
