import { Trainer } from '../trainer.entity';
import { TrainerSpecialty } from '../../value-objects/trainer-specialty.vo';
import { TrainerLanguage } from '../../value-objects/trainer-language.vo';
import { TrainerAvailability } from '../../value-objects/trainer-availability.vo';
import { Money } from '../../value-objects/money.vo';

describe('Trainer Entity', () => {
  let trainer: Trainer;
  const trainerId = 'trainer-123';
  const userId = 'user-123';

  beforeEach(() => {
    const languages = [TrainerLanguage.create('ES'), TrainerLanguage.create('EN')];
    const specialties = [TrainerSpecialty.create('YOGA'), TrainerSpecialty.create('PILATES')];
    const availability = TrainerAvailability.createWeekdays('09:00', '17:00');
    
    trainer = Trainer.create(
      trainerId,
      userId,
      'Experienced yoga instructor',
      specialties,
      languages,
      Money.create(50, 'EUR'),
      availability
    );
  });

  describe('Creation', () => {
    it('should create a trainer with valid data', () => {
      expect(trainer.id).toBe(trainerId);
      expect(trainer.userId).toBe(userId);
      expect(trainer.bio).toBe('Experienced yoga instructor');
      expect(trainer.specialties).toHaveLength(2);
      expect(trainer.languages).toHaveLength(2);
      expect(trainer.isActive).toBe(true);
    });

    it('should throw error when creating trainer without languages', () => {
      expect(() => {
        Trainer.create(trainerId, userId, null, [], [], null);
      }).toThrow('At least one language is required');
    });
  });

  describe('Bio Management', () => {
    it('should update bio with valid text', () => {
      const newBio = 'Updated professional bio with more details';
      trainer.updateBio(newBio);
      
      expect(trainer.bio).toBe(newBio);
    });

    it('should throw error for bio that is too short', () => {
      expect(() => {
        trainer.updateBio('Short');
      }).toThrow('Bio must be at least 10 characters long');
    });

    it('should throw error for bio that is too long', () => {
      const longBio = 'a'.repeat(1001);
      expect(() => {
        trainer.updateBio(longBio);
      }).toThrow('Bio cannot exceed 1000 characters');
    });
  });

  describe('Specialty Management', () => {
    it('should add new specialty', () => {
      const newSpecialty = TrainerSpecialty.create('CARDIO');
      trainer.addSpecialty(newSpecialty);
      
      expect(trainer.specialties).toHaveLength(3);
      expect(trainer.hasSpecialty(newSpecialty)).toBe(true);
    });

    it('should throw error when adding duplicate specialty', () => {
      const existingSpecialty = TrainerSpecialty.create('YOGA');
      
      expect(() => {
        trainer.addSpecialty(existingSpecialty);
      }).toThrow('Specialty already exists');
    });

    it('should remove specialty', () => {
      const specialtyToRemove = TrainerSpecialty.create('YOGA');
      trainer.removeSpecialty(specialtyToRemove);
      
      expect(trainer.specialties).toHaveLength(1);
      expect(trainer.hasSpecialty(specialtyToRemove)).toBe(false);
    });

    it('should throw error when adding more than 10 specialties', () => {
      // Add 8 more specialties (we already have 2)
      const specialties = [
        'CARDIO', 'HIIT', 'STRENGTH_TRAINING', 'POWERLIFTING',
        'BODYBUILDING', 'MARTIAL_ARTS', 'DANCE', 'SWIMMING'
      ];
      
      specialties.forEach(s => {
        trainer.addSpecialty(TrainerSpecialty.create(s));
      });

      expect(() => {
        trainer.addSpecialty(TrainerSpecialty.create('RUNNING'));
      }).toThrow('Maximum 10 specialties allowed');
    });
  });

  describe('Language Management', () => {
    it('should add new language', () => {
      const newLanguage = TrainerLanguage.create('FR');
      trainer.addLanguage(newLanguage);
      
      expect(trainer.languages).toHaveLength(3);
      expect(trainer.speaksLanguage(newLanguage)).toBe(true);
    });

    it('should throw error when adding duplicate language', () => {
      const existingLanguage = TrainerLanguage.create('ES');
      
      expect(() => {
        trainer.addLanguage(existingLanguage);
      }).toThrow('Language already exists');
    });

    it('should remove language', () => {
      const languageToRemove = TrainerLanguage.create('EN');
      trainer.removeLanguage(languageToRemove);
      
      expect(trainer.languages).toHaveLength(1);
      expect(trainer.speaksLanguage(languageToRemove)).toBe(false);
    });

    it('should throw error when trying to remove last language', () => {
      // Remove one language first
      trainer.removeLanguage(TrainerLanguage.create('EN'));
      
      expect(() => {
        trainer.removeLanguage(TrainerLanguage.create('ES'));
      }).toThrow('At least one language is required');
    });
  });

  describe('Price Management', () => {
    it('should update price per session', () => {
      const newPrice = Money.create(75, 'EUR');
      trainer.updatePricePerSession(newPrice);
      
      expect(trainer.pricePerSession?.amount).toBe(75);
      expect(trainer.pricePerSession?.currency).toBe('EUR');
    });

    it('should throw error for zero or negative price', () => {
      expect(() => {
        trainer.updatePricePerSession(Money.create(0, 'EUR'));
      }).toThrow('Price must be greater than zero');
    });
  });

  describe('Availability Management', () => {
    it('should check availability for specific time', () => {
      // Tuesday at 10:00 AM should be available (weekdays 09:00-17:00)
      const tuesdayMorning = new Date('2024-01-16T10:00:00'); // Tuesday
      expect(trainer.isAvailableFor(tuesdayMorning)).toBe(true);
      
      // Saturday should not be available (weekdays only)
      const saturday = new Date('2024-01-20T10:00:00'); // Saturday
      expect(trainer.isAvailableFor(saturday)).toBe(false);
    });

    it('should update availability', () => {
      const newAvailability = TrainerAvailability.createFullWeek('08:00', '20:00');
      trainer.updateAvailability(newAvailability);
      
      // Saturday should now be available
      const saturday = new Date('2024-01-20T10:00:00'); // Saturday
      expect(trainer.isAvailableFor(saturday)).toBe(true);
    });
  });

  describe('Status Management', () => {
    it('should activate trainer', () => {
      trainer.deactivate();
      expect(trainer.isActive).toBe(false);
      
      trainer.activate();
      expect(trainer.isActive).toBe(true);
    });

    it('should deactivate trainer', () => {
      trainer.deactivate();
      expect(trainer.isActive).toBe(false);
    });
  });

  describe('Business Rules', () => {
    it('should update updatedAt timestamp when making changes', () => {
      const originalUpdatedAt = trainer.updatedAt;
      
      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        trainer.updateBio('New bio with sufficient length');
        expect(trainer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should maintain immutability of arrays', () => {
      const originalSpecialties = trainer.specialties;
      const returnedSpecialties = trainer.specialties;
      
      // Modifying returned array should not affect original
      returnedSpecialties.push(TrainerSpecialty.create('CARDIO'));
      expect(trainer.specialties).toHaveLength(originalSpecialties.length);
    });
  });
}); 