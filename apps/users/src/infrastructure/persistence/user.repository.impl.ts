import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/libs/src/infra/prisma/prisma.service';
import { User } from '@/apps/users/src/domain/entities/user.entity';
import { UserRepository } from '@/apps/users/src/domain/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });
    
    return userData ? this.toDomain(userData) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });
    
    return userData ? this.toDomain(userData) : null;
  }

  async save(user: User): Promise<User> {
    const userData = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
        isLocked: user.isLocked,
        failedAttempts: user.failedAttempts,
        lastLogin: user.lastLogin,
        updatedAt: user.updatedAt,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
        isLocked: user.isLocked,
        failedAttempts: user.failedAttempts,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    
    return this.toDomain(userData);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  async incrementFailedAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedAttempts: {
          increment: 1,
        },
      },
    });
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedAttempts: 0,
        isLocked: false,
      },
    });
  }

  async lockAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isLocked: true,
      },
    });
  }

  async unlockAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isLocked: false,
        failedAttempts: 0,
      },
    });
  }

  private toDomain(data: any): User {
    return User.fromPersistence({
      id: data.id,
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role,
      isActive: data.isActive,
      isLocked: data.isLocked,
      failedAttempts: data.failedAttempts,
      lastLogin: data.lastLogin,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
} 