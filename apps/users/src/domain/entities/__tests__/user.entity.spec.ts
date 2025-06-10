import { User, UserRole } from '../user.entity';

describe('User Entity', () => {
  const mockUserData = {
    id: '12345',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    role: UserRole.USER,
    isActive: true,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    lastLogin: new Date('2023-01-02'),
  };

  describe('Factory Methods', () => {
    describe('create', () => {
      it('should create a new user with default values', () => {
        const user = User.create(
          'user-123',
          'john@example.com',
          'John Doe',
          'password123'
        );

        expect(user.id).toBe('user-123');
        expect(user.email).toBe('john@example.com');
        expect(user.name).toBe('John Doe');
        expect(user.password).toBe('password123');
        expect(user.role).toBe(UserRole.USER);
        expect(user.isActive).toBe(true);
        expect(user.isLocked).toBe(false);
        expect(user.failedAttempts).toBe(0);
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.updatedAt).toBeInstanceOf(Date);
        expect(user.lastLogin).toBeUndefined();
      });

      it('should create a new user with admin role', () => {
        const user = User.create(
          'admin-123',
          'admin@example.com',
          'Admin User',
          'password123',
          UserRole.ADMIN
        );

        expect(user.role).toBe(UserRole.ADMIN);
      });
    });

    describe('fromPersistence', () => {
      it('should reconstruct user from persistence data', () => {
        const user = User.fromPersistence(mockUserData);

        expect(user.id).toBe(mockUserData.id);
        expect(user.email).toBe(mockUserData.email);
        expect(user.name).toBe(mockUserData.name);
        expect(user.password).toBe(mockUserData.password);
        expect(user.role).toBe(mockUserData.role);
        expect(user.isActive).toBe(mockUserData.isActive);
        expect(user.isLocked).toBe(mockUserData.isLocked);
        expect(user.failedAttempts).toBe(mockUserData.failedAttempts);
        expect(user.createdAt).toBe(mockUserData.createdAt);
        expect(user.updatedAt).toBe(mockUserData.updatedAt);
        expect(user.lastLogin).toBe(mockUserData.lastLogin);
      });
    });
  });

  describe('Business Logic Methods', () => {
    let user: User;

    beforeEach(() => {
      user = User.fromPersistence(mockUserData);
    });

    describe('canLogin', () => {
      it('should return true when user is active and not locked', () => {
        expect(user.canLogin()).toBe(true);
      });

      it('should return false when user is inactive', () => {
        const inactiveUser = User.fromPersistence({
          ...mockUserData,
          isActive: false,
        });

        expect(inactiveUser.canLogin()).toBe(false);
      });

      it('should return false when user is locked', () => {
        const lockedUser = User.fromPersistence({
          ...mockUserData,
          isLocked: true,
        });

        expect(lockedUser.canLogin()).toBe(false);
      });

      it('should return false when user is both inactive and locked', () => {
        const blockedUser = User.fromPersistence({
          ...mockUserData,
          isActive: false,
          isLocked: true,
        });

        expect(blockedUser.canLogin()).toBe(false);
      });
    });

    describe('changePassword', () => {
      it('should update password and updatedAt timestamp', () => {
        const originalUpdatedAt = user.updatedAt;
        const newPassword = 'newHashedPassword';

        // Add small delay to ensure different timestamp
        setTimeout(() => {
          user.changePassword(newPassword);

          expect(user.password).toBe(newPassword);
          expect(user.updatedAt).toBeInstanceOf(Date);
          expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        }, 1);
      });
    });

    describe('Failed Attempts Management', () => {
      describe('incrementFailedAttempts', () => {
        it('should increment failed attempts counter', () => {
          const initialAttempts = user.failedAttempts;

          user.incrementFailedAttempts();

          expect(user.failedAttempts).toBe(initialAttempts + 1);
          expect(user.updatedAt).toBeInstanceOf(Date);
        });
      });

      describe('resetFailedAttempts', () => {
        it('should reset failed attempts to zero and unlock account', () => {
          const userWithFailedAttempts = User.fromPersistence({
            ...mockUserData,
            failedAttempts: 3,
            isLocked: true,
          });

          userWithFailedAttempts.resetFailedAttempts();

          expect(userWithFailedAttempts.failedAttempts).toBe(0);
          expect(userWithFailedAttempts.isLocked).toBe(false);
          expect(userWithFailedAttempts.updatedAt).toBeInstanceOf(Date);
        });
      });

      describe('shouldBeLocked', () => {
        it('should return false when failed attempts are below threshold', () => {
          expect(user.shouldBeLocked()).toBe(false);
        });

        it('should return true when failed attempts reach threshold', () => {
          const userWithManyAttempts = User.fromPersistence({
            ...mockUserData,
            failedAttempts: 5,
          });

          expect(userWithManyAttempts.shouldBeLocked()).toBe(true);
        });

        it('should return true when failed attempts exceed threshold', () => {
          const userWithManyAttempts = User.fromPersistence({
            ...mockUserData,
            failedAttempts: 7,
          });

          expect(userWithManyAttempts.shouldBeLocked()).toBe(true);
        });
      });
    });

    describe('Account Management', () => {
      describe('lockAccount', () => {
        it('should lock the account', () => {
          user.lockAccount();

          expect(user.isLocked).toBe(true);
          expect(user.updatedAt).toBeInstanceOf(Date);
        });
      });

      describe('unlockAccount', () => {
        it('should unlock account and reset failed attempts', () => {
          const lockedUser = User.fromPersistence({
            ...mockUserData,
            isLocked: true,
            failedAttempts: 3,
          });

          lockedUser.unlockAccount();

          expect(lockedUser.isLocked).toBe(false);
          expect(lockedUser.failedAttempts).toBe(0);
          expect(lockedUser.updatedAt).toBeInstanceOf(Date);
        });
      });

      describe('deactivate', () => {
        it('should deactivate the account', () => {
          user.deactivate();

          expect(user.isActive).toBe(false);
          expect(user.updatedAt).toBeInstanceOf(Date);
        });
      });

      describe('activate', () => {
        it('should activate the account', () => {
          const inactiveUser = User.fromPersistence({
            ...mockUserData,
            isActive: false,
          });

          inactiveUser.activate();

          expect(inactiveUser.isActive).toBe(true);
          expect(inactiveUser.updatedAt).toBeInstanceOf(Date);
        });
      });
    });

    describe('updateLastLogin', () => {
      it('should update last login timestamp', () => {
        const originalLastLogin = user.lastLogin;

        user.updateLastLogin();

        expect(user.lastLogin).toBeInstanceOf(Date);
        expect(user.lastLogin).not.toBe(originalLastLogin);
        expect(user.updatedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('Static Validation Methods', () => {
    describe('isValidEmail', () => {
      it('should return true for valid email addresses', () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'admin+tag@company.org',
          'simple@test.io',
        ];

        validEmails.forEach(email => {
          expect(User.isValidEmail(email)).toBe(true);
        });
      });

      it('should return false for invalid email addresses', () => {
        const invalidEmails = [
          'invalid-email',
          '@domain.com',
          'user@',
          'user..name@domain.com',
          '',
          'user name@domain.com',
        ];

        invalidEmails.forEach(email => {
          expect(User.isValidEmail(email)).toBe(false);
        });
      });
    });

    describe('isValidPassword', () => {
      it('should return true for passwords with 6 or more characters', () => {
        const validPasswords = [
          '123456',
          'password',
          'very-long-password',
          '!@#$%^&*()',
        ];

        validPasswords.forEach(password => {
          expect(User.isValidPassword(password)).toBe(true);
        });
      });

      it('should return false for passwords with less than 6 characters', () => {
        const invalidPasswords = [
          '',
          '1',
          '12345',
          'abc',
        ];

        invalidPasswords.forEach(password => {
          expect(User.isValidPassword(password)).toBe(false);
        });
      });
    });

    describe('isValidName', () => {
      it('should return true for valid names', () => {
        const validNames = [
          'John',
          'John Doe',
          'María García',
          'Jean-Paul',
          'O\'Connor',
        ];

        validNames.forEach(name => {
          expect(User.isValidName(name)).toBe(true);
        });
      });

      it('should return false for invalid names', () => {
        const invalidNames = [
          '',
          ' ',
          'A',
          '   ',
        ];

        invalidNames.forEach(name => {
          expect(User.isValidName(name)).toBe(false);
        });
      });
    });
  });

  describe('UserRole Enum', () => {
    it('should have USER and ADMIN values', () => {
      expect(UserRole.USER).toBe('USER');
      expect(UserRole.ADMIN).toBe('ADMIN');
    });

    it('should be used correctly in user creation', () => {
      const regularUser = User.create('1', 'user@test.com', 'User', 'pass', UserRole.USER);
      const adminUser = User.create('2', 'admin@test.com', 'Admin', 'pass', UserRole.ADMIN);

      expect(regularUser.role).toBe(UserRole.USER);
      expect(adminUser.role).toBe(UserRole.ADMIN);
    });
  });
}); 