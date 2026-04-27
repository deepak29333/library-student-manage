import { AppDataSource } from '../../config/database';
import { Student } from './student.entity';

export class StudentRepository {
  private repo = AppDataSource.getRepository(Student);

  findAllByLibrary(libraryId: string): Promise<Student[]> {
    return this.repo.find({
      where: { libraryId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Student | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'library', 'subscriptions'],
    });
  }

  findByUserId(userId: string): Promise<Student | null> {
    return this.repo.findOne({
      where: { userId },
      relations: ['user', 'library'],
    });
  }

  findBySeatAndLibrary(
    libraryId: string,
    seatNumber: number,
  ): Promise<Student | null> {
    return this.repo.findOneBy({ libraryId, seatNumber });
  }

  save(student: Partial<Student>): Promise<Student> {
    return this.repo.save(student);
  }
}
