import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/libs/src/infra/prisma/prisma.service';
import { UserRepository } from '@/apps/users/src/domain/repositories/user.repository';
import { User, UserStatus } from '@/apps/users/src/domain/entities/user.entity';
import { Profile } from '@/apps/users/src/domain/entities/profile.entity';
import { UserPreferences } from '@/apps/users/src/domain/entities/user-preferences.entity';
import { UpdateUserDto } from '@/apps/users/src/presentation/dtos/update-user.dto';
import { UpdateProfileDto } from '@/apps/users/src/presentation/dtos/update-profile.dto';
import { UpdatePreferencesDto } from '@/apps/users/src/presentation/dtos/update-preferences.dto';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        preferences: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return User.fromPersistence({
      id: user.id,
      email: user.email,
      status: user.status as UserStatus,
      profile: user.profile ? this.mapProfileToDomain(user.profile) : undefined,
      preferences: user.preferences ? this.mapPreferencesToDomain(user.preferences) : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        profile: true,
        preferences: true,
      },
    });
    return users.map(user => User.fromPersistence({
      id: user.id,
      email: user.email,
      status: user.status as UserStatus,
      profile: user.profile ? this.mapProfileToDomain(user.profile) : undefined,
      preferences: user.preferences ? this.mapPreferencesToDomain(user.preferences) : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        profile: userData.profile ? {
          create: {
            firstName: userData.profile.firstName,
            lastName: userData.profile.lastName,
            phoneNumber: userData.profile.phoneNumber,
            street: userData.profile.address.street,
            city: userData.profile.address.city,
            state: userData.profile.address.state,
            country: userData.profile.address.country,
            postalCode: userData.profile.address.postalCode,
            avatar: userData.profile.avatar,
            bio: userData.profile.bio,
          }
        } : undefined,
        preferences: userData.preferences ? {
          create: {
            language: userData.preferences.language,
            theme: userData.preferences.theme,
          }
        } : undefined,
        status: userData.status,
      },
      include: {
        profile: true,
        preferences: true,
      },
    });
    return this.mapToDomain(user);
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: userData.email,
        status: userData.status,
      },
      include: {
        profile: true,
        preferences: true,
      },
    });
    return User.fromPersistence({
      id: user.id,
      email: user.email,
      status: user.status as UserStatus,
      profile: user.profile ? this.mapProfileToDomain(user.profile) : undefined,
      preferences: user.preferences ? this.mapPreferencesToDomain(user.preferences) : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findProfile(id: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: id },
    });
    if (!profile) {
      throw new Error('Profile not found');
    }
    return this.mapProfileToDomain(profile);
  }

  async updateProfile(id: string, profileData: UpdateProfileDto): Promise<Profile> {
    const profile = await this.prisma.profile.update({
      where: { userId: id },
      data: profileData,
    });
    return this.mapProfileToDomain(profile);
  }

  async findPreferences(id: string): Promise<UserPreferences> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId: id },
    });
    if (!preferences) {
      throw new Error('Preferences not found');
    }
    return this.mapPreferencesToDomain(preferences);
  }

  async updatePreferences(id: string, preferencesData: UpdatePreferencesDto): Promise<UserPreferences> {
    const preferences = await this.prisma.userPreferences.update({
      where: { userId: id },
      data: preferencesData,
    });
    return this.mapPreferencesToDomain(preferences);
  }
  private mapProfileToDomain(prismaProfile: any): Profile {
    return new Profile(
      prismaProfile.id,
      prismaProfile.firstName,
      prismaProfile.lastName, 
      prismaProfile.phoneNumber,
      prismaProfile.address,
      prismaProfile.avatar,
      prismaProfile.bio,
      prismaProfile.createdAt,
      prismaProfile.updatedAt
    );
  }

  private mapPreferencesToDomain(prismaPreferences: any): UserPreferences {
    return {
      id: prismaPreferences.id,
      language: prismaPreferences.language,
      //emailNotifications: prismaPreferences.emailNotifications,
      //pushNotifications: prismaPreferences.pushNotifications,
      //smsNotifications: prismaPreferences.smsNotifications,
      //marketingEmails: prismaPreferences.marketingEmails,
      theme: prismaPreferences.theme,
      //profileVisibility: prismaPreferences.profileVisibility,
      //showEmail: prismaPreferences.showEmail,
      //showPhone: prismaPreferences.showPhone,
      //showAddress: prismaPreferences.showAddress,
      //createdAt: prismaPreferences.createdAt,
      //updatedAt: prismaPreferences.updatedAt,
    };
  }
  private mapToDomain(prismaUser: any): User {
    return User.fromPersistence({
      id: prismaUser.id,
      email: prismaUser.email,
      status: prismaUser.status,
      profile: prismaUser.profile ? this.mapProfileToDomain(prismaUser.profile) : undefined,
      preferences: prismaUser.preferences ? this.mapPreferencesToDomain(prismaUser.preferences) : undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt
    });
  }
}