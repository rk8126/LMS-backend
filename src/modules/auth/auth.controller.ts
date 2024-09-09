import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLocalAuthGuard } from './guards/user.local-auth.guard';
import { AdminUserLocalAuthGuard } from './guards/admin-user.local-auth.guard';
import { SuperAdminUserLocalAuthGuard } from './guards/super-admin.local-auth.guard';
import type { CommonTypes } from 'src/types/common.types';
import { RegisterDTO } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import type { User } from 'src/database/models/user.model';
@Controller('auth')
export class AuthController {
  public constructor(
    private authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('/users/register')
  @HttpCode(201)
  public async createUser(
    @Body() registerDTO: RegisterDTO
  ): Promise<{ message: string; data: { accessToken: string; user: User } }> {
    const user = await this.userService.register(registerDTO);
    return { message: 'User registered successfully', data: user };
  }

  /**
   * @returns - IUser
   */
  @UseGuards(UserLocalAuthGuard)
  @Post('/users/login')
  @HttpCode(200)
  public async userLogin(
    @Request() req: { user: CommonTypes.ValidationPayload }
  ): Promise<{ message: string; data: { accessToken: string } }> {
    const data = await this.authService.signJwtForUser(req.user);
    return {
      message: 'User logged in successfully',
      data: { accessToken: data.accessToken },
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
  ): Promise<{ message: string; data: { accessToken: string } }> {
    const data = await this.authService.signJwtForAdminUser(req.user);
    return {
      message: 'User logged in successfully',
      data: { accessToken: data.accessToken },
    };
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
