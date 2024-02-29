import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { ApplicantService } from 'src/applicant/applicant.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterApplicantDto } from 'src/applicant/dto/register-applicant.dto';
import { Applicant } from 'src/applicant/entities/applicant.entity';
import { Admin } from 'src/admin/entities/admin.entity';
@Injectable()
export class AuthService {
  constructor(
    private applicantService: ApplicantService,
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    let role = 'applicant';
    let user: Applicant | Admin =
      await this.applicantService.findOneByUsername(username);
    if (!user) {
      user = await this.adminService.findOneByUsername(username);
      role = 'admin';
    }

    const passwordMatch = await this.comparePassword(password, user.password);

    console.log({ user, passwordMatch });

    if (!user || !passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username };

    return { token: await this.jwtService.signAsync(payload), role, username };
  }

  async comparePassword(password: string, comparePassword: string) {
    if (!(await bcrypt.compare(password, comparePassword))) {
      return false;
    }
    return true;
  }

  async register(registerApplicantDto: RegisterApplicantDto): Promise<any> {
    const user = await this.applicantService.register(registerApplicantDto);
    if (!user) {
      throw new UnauthorizedException('Registration failed!!');
    }
    const payload = { sub: user.id, username: user.userName };
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: 'applicant',
    };
  }
}
