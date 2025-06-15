import { Injectable } from '@nestjs/common';
import { PasswordService } from '../../domain/services/password.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordServiceImpl implements PasswordService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
} 