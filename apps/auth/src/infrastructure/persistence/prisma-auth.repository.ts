import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Auth } from '../../domain/entities/auth.entity';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Auth | null> {
    const auth = await this.prisma.auth.findUnique({
      where: { id },
    });

    if (!auth) return null;
    return Auth.fromPersistence(auth);
  }

  async findByEmail(email: string): Promise<Auth | null> {
    const auth = await this.prisma.auth.findUnique({
      where: { email },
    });

    if (!auth) return null;
    return Auth.fromPersistence(auth);
  }

  async create(data: Partial<Auth>): Promise<Auth> {
    const auth = await this.prisma.auth.create({
      data: {
        id: data.id || crypto.randomUUID(),
        email: data.email!,
        password: data.password!,
        role: data.role!,
        isActive: data.isActive ?? true,
        isLocked: data.isLocked ?? false,
        failedAttempts: data.failedAttempts ?? 0,
        lastLogin: data.lastLogin,
        lastFailedAttempt: data.lastFailedAttempt,
        lockExpiresAt: data.lockExpiresAt,
      },
    });

    return Auth.fromPersistence(auth);
  }

  async update(id: string, data: Partial<Auth>): Promise<Auth> {
    const auth = await this.prisma.auth.update({
      where: { id },
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        isActive: data.isActive,
        isLocked: data.isLocked,
        failedAttempts: data.failedAttempts,
        lastLogin: data.lastLogin,
        lastFailedAttempt: data.lastFailedAttempt,
        lockExpiresAt: data.lockExpiresAt,
        updatedAt: new Date(),
      },
    });

    return Auth.fromPersistence(auth);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.auth.delete({
      where: { id },
    });
  }
} 