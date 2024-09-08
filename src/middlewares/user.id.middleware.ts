import type { NestMiddleware } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtPayload } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserIdMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction): void {
    if (req.headers.authorization) {
      const authInfo = req.headers.authorization?.split(' ');
      if (!authInfo[0] || !authInfo[1]) {
        throw new UnauthorizedException();
      }
      if (authInfo[0].toLowerCase() === 'bearer' && authInfo[1].includes('.')) {
        try {
          //Using verify instead of decode to ignore attacks based crafted jwt tokens that would consume requests of valid users
          const decodedToken = verify(authInfo[1], process.env.JWT_SECRET || '') as JwtPayload;
          const userId: string = decodedToken ? (decodedToken._id as string) : '';
          if (userId && userId !== '') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            req.headers['x-user-id'] = userId;
          }
        } catch (err) {
          throw new UnauthorizedException();
        }
      }
    }
    next();
  }
}
