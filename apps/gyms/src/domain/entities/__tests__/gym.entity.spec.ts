import { Gym, GymLocation, OpeningHours } from '../gym.entity';

describe('Gym Entity', () => {
  const validGymData = {
    id: 'gym-id-123',
    name: 'Test Gym',
    description: 'A test gym',
    address: '123 Test St',
    location: { latitude: 40.7128, longitude: -74.0060 } as GymLocation,
    phone: '+1-555-123-4567',
    email: 'test@gym.com',
    openingHours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
    } as OpeningHours,
    ownerId: 'owner-id-123',
  };

  describe('create', () => {
    it('should create a new gym with all required properties', () => {
      // Act
      const gym = Gym.create(validGymData);

      // Assert
      expect(gym.id).toBe(validGymData.id);
      expect(gym.name).toBe(validGymData.name);
      expect(gym.description).toBe(validGymData.description);
      expect(gym.address).toBe(validGymData.address);
      expect(gym.location).toEqual(validGymData.location);
      expect(gym.phone).toBe(validGymData.phone);
      expect(gym.email).toBe(validGymData.email);
      expect(gym.openingHours).toEqual(validGymData.openingHours);
      expect(gym.ownerId).toBe(validGymData.ownerId);
      expect(gym.isActive).toBe(true);
      expect(gym.createdAt).toBeInstanceOf(Date);
      expect(gym.updatedAt).toBeInstanceOf(Date);
      expect(gym.createdAt).toEqual(gym.updatedAt);
    });

    it('should set isActive to true by default', () => {
      // Act
      const gym = Gym.create(validGymData);

      // Assert
      expect(gym.isActive).toBe(true);
    });

    it('should set creation and update timestamps to the same value', () => {
      // Act
      const gym = Gym.create(validGymData);

      // Assert
      expect(gym.createdAt).toEqual(gym.updatedAt);
    });
  });

  describe('update', () => {
    let originalGym: Gym;

    beforeEach(() => {
      originalGym = Gym.create(validGymData);
      // Simulate some time passing
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-02'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update gym properties while preserving immutability', () => {
      // Arrange
      const updateData = {
        name: 'Updated Gym Name',
        description: 'Updated description',
      };

      // Act
      const updatedGym = originalGym.update(updateData);

      // Assert
      expect(updatedGym).not.toBe(originalGym); // Different instances
      expect(updatedGym.name).toBe(updateData.name);
      expect(updatedGym.description).toBe(updateData.description);
      expect(updatedGym.address).toBe(originalGym.address); // Unchanged
      expect(updatedGym.id).toBe(originalGym.id); // Unchanged
      expect(updatedGym.ownerId).toBe(originalGym.ownerId); // Unchanged
      expect(updatedGym.createdAt).toEqual(originalGym.createdAt); // Unchanged
      expect(updatedGym.updatedAt).not.toEqual(originalGym.updatedAt); // Changed
    });

    it('should update location coordinates', () => {
      // Arrange
      const newLocation = { latitude: 41.8781, longitude: -87.6298 };

      // Act
      const updatedGym = originalGym.update({ location: newLocation });

      // Assert
      expect(updatedGym.location).toEqual(newLocation);
      expect(updatedGym.location).not.toBe(originalGym.location);
    });

    it('should update opening hours', () => {
      // Arrange
      const newOpeningHours = {
        monday: { open: '06:00', close: '23:00' },
        wednesday: { open: '08:00', close: '20:00' },
      };

      // Act
      const updatedGym = originalGym.update({ openingHours: newOpeningHours });

      // Assert
      expect(updatedGym.openingHours).toEqual(newOpeningHours);
      expect(updatedGym.openingHours).not.toBe(originalGym.openingHours);
    });

    it('should preserve unchanged properties when updating', () => {
      // Arrange
      const updateData = { name: 'New Name' };

      // Act
      const updatedGym = originalGym.update(updateData);

      // Assert
      expect(updatedGym.description).toBe(originalGym.description);
      expect(updatedGym.address).toBe(originalGym.address);
      expect(updatedGym.phone).toBe(originalGym.phone);
      expect(updatedGym.email).toBe(originalGym.email);
      expect(updatedGym.location).toEqual(originalGym.location);
      expect(updatedGym.openingHours).toEqual(originalGym.openingHours);
    });
  });

  describe('deactivate', () => {
    it('should deactivate gym while preserving other properties', () => {
      // Arrange
      const gym = Gym.create(validGymData);
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-02'));

      // Act
      const deactivatedGym = gym.deactivate();

      // Assert
      expect(deactivatedGym).not.toBe(gym); // Different instances
      expect(deactivatedGym.isActive).toBe(false);
      expect(deactivatedGym.id).toBe(gym.id);
      expect(deactivatedGym.name).toBe(gym.name);
      expect(deactivatedGym.ownerId).toBe(gym.ownerId);
      expect(deactivatedGym.createdAt).toEqual(gym.createdAt);
      expect(deactivatedGym.updatedAt).not.toEqual(gym.updatedAt);

      jest.useRealTimers();
    });
  });

  describe('isOwnedBy', () => {
    it('should return true when user is the owner', () => {
      // Arrange
      const gym = Gym.create(validGymData);

      // Act & Assert
      expect(gym.isOwnedBy(validGymData.ownerId)).toBe(true);
    });

    it('should return false when user is not the owner', () => {
      // Arrange
      const gym = Gym.create(validGymData);

      // Act & Assert
      expect(gym.isOwnedBy('different-user-id')).toBe(false);
    });

    it('should return false for empty or null user ID', () => {
      // Arrange
      const gym = Gym.create(validGymData);

      // Act & Assert
      expect(gym.isOwnedBy('')).toBe(false);
      expect(gym.isOwnedBy(null as any)).toBe(false);
      expect(gym.isOwnedBy(undefined as any)).toBe(false);
    });
  });
}); 