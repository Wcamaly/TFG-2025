export class Address {
  private readonly _id: string;
  private _street: string;
  private _city: string;
  private _state: string;
  private _country: string;
  private _postalCode: string;
  private _latitude: number;
  private _longitude: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string,
    latitude: number,
    longitude: number,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this._id = id;
    this._street = street;
    this._city = city;
    this._state = state;
    this._country = country;
    this._postalCode = postalCode;
    this._latitude = latitude;
    this._longitude = longitude;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get street(): string {
    return this._street;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get country(): string {
    return this._country;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio
  async update(street: string, city: string, state: string, country: string, postalCode: string): Promise<void> {
    this._street = street;
    this._city = city;
    this._state = state;
    this._country = country;
    this._postalCode = postalCode;
    this._updatedAt = new Date();
    
    // Recalcular coordenadas al actualizar la dirección
    const coordinates = await this.calculateCoordinates();
    this._latitude = coordinates.latitude;
    this._longitude = coordinates.longitude;
  }

  private async calculateCoordinates(): Promise<{ latitude: number; longitude: number }> {
    const addressString = `${this._street}, ${this._city}, ${this._state}, ${this._country}, ${this._postalCode}`;
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      }
      
      throw new Error('No se pudieron obtener las coordenadas');
    } catch (error) {
      console.error('Error al calcular coordenadas:', error);
      // En caso de error, devolver coordenadas por defecto (0,0)
      return { latitude: 0, longitude: 0 };
    }
  }

  // Factory method para crear una nueva dirección
  static async create(
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string,
  ): Promise<Address> {
    const address = new Address(
      crypto.randomUUID(),
      street,
      city,
      state,
      country,
      postalCode,
      0, // latitud temporal
      0, // longitud temporal
    );

    // Calcular coordenadas
    const coordinates = await address.calculateCoordinates();
    address._latitude = coordinates.latitude;
    address._longitude = coordinates.longitude;

    return address;
  }

  // Factory method para reconstruir una dirección desde la persistencia
  static fromPersistence(data: {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
  }): Address {
    return new Address(
      data.id,
      data.street,
      data.city,
      data.state,
      data.country,
      data.postalCode,
      data.latitude,
      data.longitude,
      data.createdAt,
      data.updatedAt,
    );
  }
} 