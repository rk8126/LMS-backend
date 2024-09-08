import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { AdminUser } from 'src/database/models/admin.user.model';
import { SecretManager } from 'src/utils/secret-manager.utils';
import type { CreateAdminUserDTO } from './dto/admin.dto';
import { AdminDbService } from 'src/database/services/admin.db.service';

@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);

  public constructor(
    private readonly secretManager: SecretManager,
    private adminDbService: AdminDbService
  ) {}

  /**
   *  Create admin user
   * @param param0  CreateAdminUserDTO
   * @returns   AdminUser object
   */
  public async createAdminUser(createAdminUserDTO: CreateAdminUserDTO): Promise<AdminUser> {
    try {
      const existingUser = await this.adminDbService.findAdminUserByEmail(createAdminUserDTO.email);

      if (existingUser) {
        throw new BadRequestException('Admin user already exists with email');
      }

      const { secretHash } = await this.secretManager.generateHashFromString(
        createAdminUserDTO.secret
      );
      const adminUser = await this.adminDbService.createAdminUser({
        fullName: createAdminUserDTO.fullName,
        email: createAdminUserDTO.email,
        secret: secretHash,
        isSuperAdmin: createAdminUserDTO.isSuperAdmin || false,
      });
      return {
        ...adminUser,
        secret: '',
      };
    } catch (error) {
      this.logger.error(`Error creating admin user: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
