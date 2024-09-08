import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StudentLocalAuthGuard } from './guards/student.local-auth.guard';
import { AdminUserLocalAuthGuard } from './guards/admin-user.local-auth.guard';
import { SuperAdminUserLocalAuthGuard } from './guards/super-admin.local-auth.guard';
import type { CommonTypes } from 'src/types/common.types';
@Controller('auth')
export class AuthController {
  public constructor(private authService: AuthService) {}

  /**
   * @returns - IStudent
   */
  @UseGuards(StudentLocalAuthGuard)
  @Post('/students/login')
  @HttpCode(200)
  public async studentLogin(
    @Request() req: { user: CommonTypes.ValidationPayload }
  ): Promise<CommonTypes.IStudent> {
    return {
      accessToken: (await this.authService.signJwtForStudent(req.user)).accessToken,
    };
  }

  /**
   *  This endpoint is used to login the admin user with email and password
   * @param req   - Request object containing user
   * @returns   - IAdminUser
   */
  @UseGuards(AdminUserLocalAuthGuard)
  @Post('/admin/login')
  @HttpCode(200)
  public async adminUserLogin(
    @Request() req: { user: CommonTypes.ValidationPayload }
  ): Promise<CommonTypes.IAdminUser> {
    return this.authService.signJwtForAdminUser(req.user);
  }

  /**
   *  This endpoint is used to login the super admin user with email and password
   * @param req   - Request object containing user
   * @returns   - IAdminUser
   */
  @UseGuards(SuperAdminUserLocalAuthGuard)
  @Post('/super-admin/login')
  @HttpCode(200)
  public async superAdminUserLogin(
    @Request() req: { user: CommonTypes.ValidationPayload }
  ): Promise<CommonTypes.IAdminUser> {
    return this.authService.signJwtForAdminUser(req.user);
  }
}
