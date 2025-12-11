import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Animal } from './Animal';
import { User } from './User';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  ownerName: string;

  @Column({ nullable: true })
  ownerEmail?: string;

  @Column({ nullable: true })
  ownerPhone?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalArea?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Animal, animal => animal.farm)
  animals: Animal[];

  @OneToMany(() => User, user => user.farm)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  constructor(name: string, location: string, ownerName: string) {
    this.name = name;
    this.location = location;
    this.ownerName = ownerName;
    this.isActive = true;
  }

  updateDetails(name?: string, location?: string, ownerName?: string, description?: string): void {
    if (name) this.name = name;
    if (location) this.location = location;
    if (ownerName) this.ownerName = ownerName;
    if (description) this.description = description;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  getAnimalCount(): number {
    return this.animals ? this.animals.filter(animal => animal.isActive).length : 0;
  }

  getUserCount(): number {
    return this.users ? this.users.length : 0;
  }

  getActiveAnimals(): Animal[] {
    return this.animals ? this.animals.filter(animal => animal.isActive) : [];
  }

  addAnimal(animal: Animal): void {
    if (!this.animals) {
      this.animals = [];
    }
    this.animals.push(animal);
  }

  removeAnimal(animalId: string): boolean {
    if (!this.animals) return false;
    const index = this.animals.findIndex(animal => animal.id === animalId);
    if (index !== -1) {
      this.animals.splice(index, 1);
      return true;
    }
    return false;
  }

  getLocationCoordinates(): { latitude: number; longitude: number } | null {
    if (!this.location) return null;
    const coords = this.location.split(',').map(coord => parseFloat(coord.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      return { latitude: coords[0], longitude: coords[1] };
    }
    return null;
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this.name || this.name.trim().length === 0) {
      errors.push('El nombre de la finca es requerido');
    }
    if (!this.location || this.location.trim().length === 0) {
      errors.push('La ubicación de la finca es requerida');
    }
    if (!this.ownerName || this.ownerName.trim().length === 0) {
      errors.push('El nombre del propietario es requerido');
    }
    if (this.totalArea !== undefined && this.totalArea <= 0) {
      errors.push('El área total debe ser mayor a 0');
    }
    return errors;
  }
}
