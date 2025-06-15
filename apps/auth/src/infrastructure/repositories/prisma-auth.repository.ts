import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Auth } from '../../domain/entities/auth.entity';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToAuth(data: any) {
    return {
      id: data.id,
      email: data.userId, // userId en Prisma es el email
      password: data.password,
      role: data.role,
      isVerified: data.isActive,
      lastLogin: data.lastLogin,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findById(id: string): Promise<Auth | null> {
    const auth = await this.prisma.auth.findUnique({
      where: { id },
    });
    return auth ? Auth.create(this.mapToAuth(auth)) : null;
  }

  async findByEmail(email: string): Promise<Auth | null> {
    const auth = await this.prisma.auth.findUnique({
      where: { userId: email },
    });
    return auth ? Auth.create(this.mapToAuth(auth)) : null;
  }

  async save(auth: Auth): Promise<Auth> {
    const created = await this.prisma.auth.create({
      data: {
        id: auth.id,
        userId: auth.email,
        password: auth.password,
        role: auth.role,
        isActive: auth.isVerified,
        lastLogin: auth.lastLogin,
        createdAt: auth.createdAt,
        updatedAt: auth.updatedAt,
      },
    });
    return Auth.create(this.mapToAuth(created));
  }

  async update(id: string, data: Partial<Auth>): Promise<Auth> {
    const updated = await this.prisma.auth.update({
      where: { id },
      data: {
        userId: data.email,
        password: data.password,
        role: data.role,
        isActive: data.isVerified,
        lastLogin: data.lastLogin,
        updatedAt: new Date(),
      },
    });
    return Auth.create(this.mapToAuth(updated));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.auth.delete({
      where: { id },
    });
  }
} 