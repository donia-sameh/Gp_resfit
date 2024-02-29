import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { AdminService } from 'src/admin/admin.service';
import { ApplicantService } from 'src/applicant/applicant.service';

@Injectable()
export class AuthAllGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
    private applicantService: ApplicantService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const userIsAdmin = await this.adminService.findOneByUsername(
        payload.username,
      );
      const userIsApplicant = await this.applicantService.findOneByUsername(
        payload.username,
      );

      if (!userIsAdmin && !userIsApplicant) {
        throw new UnauthorizedException();
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
