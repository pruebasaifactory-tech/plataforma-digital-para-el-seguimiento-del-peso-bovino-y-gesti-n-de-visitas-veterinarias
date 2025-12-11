import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Farm } from './Farm';
import { WeightRecord } from './WeightRecord';
import { VeterinaryVisit } from './VeterinaryVisit';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  earTag: string;

  @Column()
  name: string;

  @Column()
  breed: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  sex: 'male' | 'female';

  @Column({ nullable: true })
  motherId?: string;

  @Column({ nullable: true })
  fatherId?: string;

  @Column()
  farmId: string;

  @ManyToOne(() => Farm, farm => farm.animals)
  @JoinColumn({ name: 'farmId' })
  farm: Farm;

  @OneToMany(() => WeightRecord, weightRecord => weightRecord.animal)
  weightRecords: WeightRecord[];

  @OneToMany(() => VeterinaryVisit, visit => visit.animal)
  veterinaryVisits: VeterinaryVisit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  constructor(earTag: string, name: string, breed: string, birthDate: Date, sex: 'male' | 'female', farmId: string) {
    this.earTag = earTag;
    this.name = name;
    this.breed = breed;
    this.birthDate = birthDate;
    this.sex = sex;
    this.farmId = farmId;
    this.isActive = true;
  }

  updateDetails(name?: string, breed?: string, birthDate?: Date): void {
    if (name) this.name = name;
    if (breed) this.breed = breed;
    if (birthDate) this.birthDate = birthDate;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  getAgeInMonths(): number {
    const today = new Date();
    const birth = new Date(this.birthDate);
    const months = (today.getFullYear() - birth.getFullYear()) * 12;
    return months + (today.getMonth() - birth.getMonth());
  }

  getCurrentWeight(): number | null {
    if (!this.weightRecords || this.weightRecords.length === 0) {
      return null;
    }
    const sortedRecords = [...this.weightRecords].sort((a, b) => 
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );
    return sortedRecords[0].weight;
  }

  getWeightHistory(): Array<{ date: Date; weight: number }> {
    if (!this.weightRecords) {
      return [];
    }
    return this.weightRecords
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
      .map(record => ({
        date: record.recordedAt,
        weight: record.weight
      }));
  }

  getLastVeterinaryVisit(): VeterinaryVisit | null {
    if (!this.veterinaryVisits || this.veterinaryVisits.length === 0) {
      return null;
    }
    const sortedVisits = [...this.veterinaryVisits].sort((a, b) => 
      new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );
    return sortedVisits[0];
  }
}
