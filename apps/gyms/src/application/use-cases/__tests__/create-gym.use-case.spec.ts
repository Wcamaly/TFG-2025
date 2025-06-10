import { Test, TestingModule } from '@nestjs/testing';
import { CreateGymUseCase, CreateGymCommand, GymAlreadyExistsError } from '../create-gym.use-case';
import { GymRepository } from '../../../domain/repositories/gym.repository';
import { Gym } from '../../../domain/entities/gym.entity';

describe('CreateGymUseCase', () => {
  let useCase: CreateGymUseCase;
  let gymRepository: jest.Mocked<GymRepository>;

  const mockGymRepository = {
    findById: jest.fn(),
    findByName: jest.fn(),
    findByLocation: jest.fn(),
    findByFilters: jest.fn(),
    findByOwnerId: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    existsByNameAndLocation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateGymUseCase,
        {
          provide: 'GymRepository',
          useValue: mockGymRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateGymUseCase>(CreateGymUseCase);
    gymRepository = module.get('GymRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validCommand: CreateGymCommand = {
      name: 'Test Gym',
      description: 'A test gym',
      address: '123 Test St',
      location: { latitude: 40.7128, longitude: -74.0060 },
      phone: '+1-555-123-4567',
      email: 'test@gym.com',
      openingHours: {
        monday: { open: '08:00', close: '22:00' },
        tuesday: { open: '08:00', close: '22:00' },
      },
      ownerId: 'owner-id-123',
    };

    it('should create a gym successfully when no conflicts exist', async () => {
      // Arrange
      const expectedGym = Gym.create({
        id: expect.any(String),
        ...validCommand,
      });
      
      gymRepository.existsByNameAndLocation.mockResolvedValue(false);
      gymRepository.save.mockResolvedValue(expectedGym);

      // Act
      const result = await useCase.execute(validCommand);

      // Assert
      expect(gymRepository.existsByNameAndLocation).toHaveBeenCalledWith(
        validCommand.name,
        validCommand.location.latitude,
        validCommand.location.longitude,
        1
      );
      expect(gymRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: validCommand.name,
          description: validCommand.description,
          address: validCommand.address,
          location: validCommand.location,
          phone: validCommand.phone,
          email: validCommand.email,
          openingHours: validCommand.openingHours,
          ownerId: validCommand.ownerId,
        })
      );
      expect(result).toEqual(expectedGym);
    });

    it('should throw GymAlreadyExistsError when gym exists in same location', async () => {
      // Arrange
      gymRepository.existsByNameAndLocation.mockResolvedValue(true);

      // Act & Assert
      await expect(useCase.execute(validCommand)).rejects.toThrow(GymAlreadyExistsError);
      expect(gymRepository.existsByNameAndLocation).toHaveBeenCalledWith(
        validCommand.name,
        validCommand.location.latitude,
        validCommand.location.longitude,
        1
      );
      expect(gymRepository.save).not.toHaveBeenCalled();
    });

    it('should generate unique ID for each gym', async () => {
      // Arrange
      gymRepository.existsByNameAndLocation.mockResolvedValue(false);
      gymRepository.save.mockImplementation((gym) => Promise.resolve(gym));

      // Act
      const result1 = await useCase.execute(validCommand);
      const result2 = await useCase.execute({
        ...validCommand,
        name: 'Another Gym',
      });

      // Assert
      expect(result1.id).toBeDefined();
      expect(result2.id).toBeDefined();
      expect(result1.id).not.toEqual(result2.id);
    });

    it('should set creation and update timestamps', async () => {
      // Arrange
      const beforeExecution = new Date();
      gymRepository.existsByNameAndLocation.mockResolvedValue(false);
      gymRepository.save.mockImplementation((gym) => Promise.resolve(gym));

      // Act
      const result = await useCase.execute(validCommand);
      const afterExecution = new Date();

      // Assert
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.getTime()).toBeGreaterThanOrEqual(beforeExecution.getTime());
      expect(result.createdAt.getTime()).toBeLessThanOrEqual(afterExecution.getTime());
      expect(result.createdAt).toEqual(result.updatedAt);
    });

    it('should set gym as active by default', async () => {
      // Arrange
      gymRepository.existsByNameAndLocation.mockResolvedValue(false);
      gymRepository.save.mockImplementation((gym) => Promise.resolve(gym));

      // Act
      const result = await useCase.execute(validCommand);

      // Assert
      expect(result.isActive).toBe(true);
    });
  });
}); 