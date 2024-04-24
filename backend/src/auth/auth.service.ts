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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, odooApplicantId: __, ...rest } = user as Applicant;
    const payload = { sub: user.id, ...rest };

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, odooApplicantId, ...rest } = user;
    const payload = { sub: user.id, ...rest };
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: 'applicant',
    };
  }
}
