import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { IAuthResponse } from '~/src/modules/auth/types';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ):
    | Observable<Omit<IAuthResponse, 'refreshToken'>>
    | Promise<Observable<Omit<IAuthResponse, 'refreshToken'>>> {
    const response: Response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(({ refreshToken, ...otherData }: IAuthResponse) => {
        response.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: Number(process.env.JWT_REFRESH_EXP || 0), // in ms
          secure: process.env.NODE_ENV === 'production' ? true : false,
        });

        return otherData;
      }),
    );
  }
}
