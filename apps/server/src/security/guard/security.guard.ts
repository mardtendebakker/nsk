import { InjectCognitoJwtVerifier, CognitoJwtVerifier } from '@nestjs-cognito/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Group } from '../../user/model/group.enum';
import { ConnectedUserType } from '../decorator/connected-user.decorator';
import { SecuritySystem } from '../security.system';
import { SECURITY_SYSTEM } from '../const';

@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectCognitoJwtVerifier()
    private jwtVerifier: CognitoJwtVerifier,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    try {
      request.user = this.configService.get(SECURITY_SYSTEM) == SecuritySystem.COGNITO ? await this.cognitoVerify(token) : this.jwtVerify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async cognitoVerify(token: string): Promise<ConnectedUserType> {
    const result = await this.jwtVerifier.verify(token);

    return {
      id: result.sub,
      username: result['cognito:username'] as string,
      email: result.email as string,
      groups: result['cognito:groups'] as Group[],
      email_verified: result.email_verified as boolean,
    };
  }

  private jwtVerify(token: string): ConnectedUserType {
    return this.jwtService.verify<ConnectedUserType>(
      token,
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );
  }
}
