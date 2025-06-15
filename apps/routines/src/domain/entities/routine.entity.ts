export enum RoutineDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export class Routine {
  private readonly id: string;
  private readonly trainerId: string;
  private title: string;
  private description: string;
  private difficulty: RoutineDifficulty;
  private duration: number;
  private language: string;
  private tags: string[];
  private published: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id?: string;
    trainerId: string;
    title: string;
    description: string;
    difficulty: RoutineDifficulty;
    duration: number;
    language: string;
    tags: string[];
    isPublished?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id || crypto.randomUUID();
    this.trainerId = props.trainerId;
    this.title = props.title;
    this.description = props.description;
    this.difficulty = props.difficulty;
    this.duration = props.duration;
    this.language = props.language;
    this.tags = props.tags;
    this.published = props.isPublished ?? false;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getTrainerId(): string {
    return this.trainerId;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getDifficulty(): RoutineDifficulty {
    return this.difficulty;
  }

  getDuration(): number {
    return this.duration;
  }

  getLanguage(): string {
    return this.language;
  }

  getTags(): string[] {
    return this.tags;
  }

  isPublished(): boolean {
    return this.published;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters
  updateTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  updateDifficulty(difficulty: RoutineDifficulty): void {
    this.difficulty = difficulty;
    this.updatedAt = new Date();
  }

  updateDuration(duration: number): void {
    this.duration = duration;
    this.updatedAt = new Date();
  }

  updateLanguage(language: string): void {
    this.language = language;
    this.updatedAt = new Date();
  }

  updateTags(tags: string[]): void {
    this.tags = tags;
    this.updatedAt = new Date();
  }

  publish(): void {
    this.published = true;
    this.updatedAt = new Date();
  }

  unpublish(): void {
    this.published = false;
    this.updatedAt = new Date();
  }
} 