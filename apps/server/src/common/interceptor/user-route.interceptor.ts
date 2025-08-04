import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

@Injectable()
export class UserRouteInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user ?? {};
    this.cls.set('username', user.username ?? 'anonymous');
    this.cls.set('groups', user.groups ?? []);
    this.cls.set('method', request.method);
    this.cls.set('route', request.originalUrl);
    this.cls.set('body', request.body);
    this.cls.set('params', request.params);
    return next.handle();
  }
}
