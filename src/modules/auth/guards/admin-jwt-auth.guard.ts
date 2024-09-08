import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT AuthGuard to avoid magic strings in the code
 */
@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('admin-jwt') {}
