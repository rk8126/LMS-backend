import { Injectable, InternalServerErrorException } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as bcrypt from 'bcryptjs';
import { CommonConstants } from '../modules/common/constants/common.constants';

@Injectable()
export class SecretManager {
  public async generateHashFromString(inputString: string): Promise<{ secretHash: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const secretHash: string = (await bcrypt.hash(
        inputString,
        CommonConstants.HASH_SALT_ROUNDS
      )) as string;
      return { secretHash };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error generating hash from string - ${JSON.stringify(error)}`
      );
    }
  }

  public async compareSecret(secret: string, dbHash: string): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const isMatch: boolean = await bcrypt.compare(secret, dbHash);
      return isMatch;
    } catch (error) {
      throw new InternalServerErrorException(`Error comparing secret - ${JSON.stringify(error)}`);
    }
  }
}
