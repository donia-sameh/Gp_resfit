import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get,
  Param,
  UnauthorizedException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterApplicantDto } from 'src/applicant/dto/register-applicant.dto';
import { AuthAllGuard } from './auth guard/auth-all.guard';
import { ApplicantService } from 'src/applicant/applicant.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private applicantService: ApplicantService,
  ) {}

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

  // @UseGuards(AuthAllGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
  @UseGuards(AuthAllGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.id; // Assuming the user ID is stored in the request object after authentication
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userProfile = await this.applicantService.getUserProfile(userId);
    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    return userProfile;
  }
}
