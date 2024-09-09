import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
/**
 * LocalAuthGuard to avoid magic strings in the code
 */
export class UserLocalAuthGuard extends AuthGuard('user') {}
