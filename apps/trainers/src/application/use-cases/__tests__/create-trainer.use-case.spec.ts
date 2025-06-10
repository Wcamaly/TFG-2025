import { ConflictException } from '@nestjs/common';
import { CreateTrainerUseCase, CreateTrainerCommand } from '../create-trainer.use-case';
import { TrainerRepository } from '../../../domain/repositories/trainer.repository';
import { Trainer } from '../../../domain/entities/trainer.entity';

describe('CreateTrainerUseCase', () => {
  let useCase: CreateTrainerUseCase;
  let mockTrainerRepository: jest.Mocked<TrainerRepository>;

  beforeEach(() => {
    mockTrainerRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByFilters: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      existsByUserId: jest.fn(),
      findBySpecialty: jest.fn(),
      findByLanguage: jest.fn(),
      findByPriceRange: jest.fn(),
      findByMinimumRating: jest.fn(),
      countActive: jest.fn(),
    };

    useCase = new CreateTrainerUseCase(mockTrainerRepository);
  });

  describe('execute', () => {
    const validCommand: CreateTrainerCommand = {
      userId: 'user-123',
      bio: 'Experienced personal trainer with 5 years of experience',
      specialties: ['YOGA', 'PILATES'],
      languages: ['ES', 'EN'],
      pricePerSession: {
        amount: 50,
        currency: 'EUR'
      },
      availableTimes: {
        MONDAY: {
          isAvailable: true,
          timeSlots: [{ start: '09:00', end: '17:00' }]
        }
      }
    };

    it('should create trainer successfully with valid data', async () => {
      // Arrange
      mockTrainerRepository.findByUserId.mockResolvedValue(null);
      mockTrainerRepository.save.mockResolvedValue();

      // Act
      const result = await useCase.execute(validCommand);

      // Assert
      expect(result).toEqual({
        id: expect.any(String),
        userId: 'user-123',
        message: 'Perfil de entrenador creado exitosamente'
      });

      expect(mockTrainerRepository.findByUserId).toHaveBeenCalledWith('user-123');
      expect(mockTrainerRepository.save).toHaveBeenCalledWith(expect.any(Trainer));
    });

    it('should throw ConflictException when user already has trainer profile', async () => {
      // Arrange
      const existingTrainer = {} as Trainer; // Mock existing trainer
      mockTrainerRepository.findByUserId.mockResolvedValue(existingTrainer);

      // Act & Assert
      await expect(useCase.execute(validCommand)).rejects.toThrow(ConflictException);
      await expect(useCase.execute(validCommand)).rejects.toThrow('El usuario ya tiene un perfil de entrenador');

      expect(mockTrainerRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when no languages provided', async () => {
      // Arrange
      mockTrainerRepository.findByUserId.mockResolvedValue(null);
      const commandWithoutLanguages = {
        ...validCommand,
        languages: []
      };

      // Act & Assert
      await expect(useCase.execute(commandWithoutLanguages)).rejects.toThrow('Al menos un idioma es requerido');
      expect(mockTrainerRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for invalid specialty', async () => {
      // Arrange
      mockTrainerRepository.findByUserId.mockResolvedValue(null);
      const commandWithInvalidSpecialty = {
        ...validCommand,
        specialties: ['INVALID_SPECIALTY']
      };

      // Act & Assert
      await expect(useCase.execute(commandWithInvalidSpecialty)).rejects.toThrow('Especialidad inválida');
      expect(mockTrainerRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for invalid language', async () => {
      // Arrange
      mockTrainerRepository.findByUserId.mockResolvedValue(null);
      const commandWithInvalidLanguage = {
        ...validCommand,
        languages: ['INVALID_LANG']
      };

      // Act & Assert
      await expect(useCase.execute(commandWithInvalidLanguage)).rejects.toThrow('Idioma inválido');
      expect(mockTrainerRepository.save).not.toHaveBeenCalled();
    });

    it('should create trainer without optional fields', async () => {
      // Arrange
      mockTrainerRepository.findByUserId.mockResolvedValue(null);
      mockTrainerRepository.save.mockResolvedValue();

      const minimalCommand: CreateTrainerCommand = {
        userId: 'user-123',
        specialties: ['YOGA'],
        languages: ['ES']
      };

      // Act
      const result = await useCase.execute(minimalCommand);

      // Assert
      expect(result).toEqual({
        id: expect.any(String),
        userId: 'user-123',
        message: 'Perfil de entrenador creado exitosamente'
      });

      expect(mockTrainerRepository.save).toHaveBeenCalledWith(expect.any(Trainer));
    });

    it('should handle empty specialties array', async () => {
      // Arrange
      mockTrainerRepository.findByUserId.mockResolvedValue(null);
      mockTrainerRepository.save.mockResolvedValue();

      const commandWithoutSpecialties = {
        ...validCommand,
        specialties: []
      };

      // Act
      const result = await useCase.execute(commandWithoutSpecialties);

      // Assert
      expect(result).toEqual({
        id: expect.any(String),
        userId: 'user-123',
        message: 'Perfil de entrenador creado exitosamente'
      });

      expect(mockTrainerRepository.save).toHaveBeenCalledWith(expect.any(Trainer));
    });

    it('should filter out empty specialty strings', async () => {
      // Arrange
      mockTrainerRepository.findByUserId.mockResolvedValue(null);
      mockTrainerRepository.save.mockResolvedValue();

      const commandWithEmptySpecialties = {
        ...validCommand,
        specialties: ['YOGA', '', '  ', 'PILATES']
      };

      // Act
      const result = await useCase.execute(commandWithEmptySpecialties);

      // Assert
      expect(result).toEqual({
        id: expect.any(String),
        userId: 'user-123',
        message: 'Perfil de entrenador creado exitosamente'
      });

      expect(mockTrainerRepository.save).toHaveBeenCalledWith(expect.any(Trainer));
    });

    it('should filter out empty language strings', async () => {
      // Arrange
      mockTrainerRepository.findByUserId.mockResolvedValue(null);
      mockTrainerRepository.save.mockResolvedValue();

      const commandWithEmptyLanguages = {
        ...validCommand,
        languages: ['ES', '', '  ', 'EN']
      };

      // Act
      const result = await useCase.execute(commandWithEmptyLanguages);

      // Assert
      expect(result).toEqual({
        id: expect.any(String),
        userId: 'user-123',
        message: 'Perfil de entrenador creado exitosamente'
      });

      expect(mockTrainerRepository.save).toHaveBeenCalledWith(expect.any(Trainer));
    });
  });
}); 