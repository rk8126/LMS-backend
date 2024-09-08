import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SuperAdminJwtAuthGuard } from '../auth/guards/super-admin-jwt-auth.guard';
import { CreateAdminUserDTO } from './dto/admin.dto';
import { AdminService } from './admin.service';
import type { AdminUser } from 'src/database/models/admin.user.model';

@Controller('admin')
export class AdminController {
  public constructor(private readonly adminUserService: AdminService) {}

  @UseGuards(SuperAdminJwtAuthGuard)
  @Post('/user')
  @HttpCode(201)
  public async createAdminUser(
    @Body() createAdminUserDTO: CreateAdminUserDTO
  ): Promise<{ message: string; data: AdminUser }> {
    const data = await this.adminUserService.createAdminUser(createAdminUserDTO);
    return { message: 'Admin user created', data: data };
  }
}
