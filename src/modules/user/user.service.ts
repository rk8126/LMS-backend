import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from 'src/database/models/user.model';
import type { RegisterDTO } from './dto/user.dto';
import type { CommonTypes } from 'src/types/common.types';
import { SecretManager } from 'src/utils/secret-manager.utils';
import { UserDbService } from 'src/database/services/user.db.service';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  public constructor(
    private readonly userDbService: UserDbService,
    private readonly jwtService: JwtService,
    private readonly secretManager: SecretManager
  ) {}

  public async register(registerDto: RegisterDTO): Promise<{ accessToken: string; user: User }> {
    try {
      const existingUser = await this.userDbService.findUserByEmail(registerDto.email);
      if (existingUser) {
        throw new BadRequestException('User already exists with email');
      }
      const { secretHash } = await this.secretManager.generateHashFromString(registerDto.secret);
      const user = await this.userDbService.createUser({
        fullName: registerDto.fullName,
        email: registerDto.email,
        secret: secretHash,
      });
      const payload: CommonTypes.ValidationPayload = {
        _id: String(user._id),
        email: user.email,
        fullName: user.fullName,
      };
      // console.log('payload is here', payload, this.jwtService.sign(payload));
      return {
        accessToken: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
        user: { ...user, secret: '' },
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
