import { AppDataSource } from '../../config/database';
import { Library } from './library.entity';

export class LibraryRepository {
  private repo = AppDataSource.getRepository(Library);

  findAll(): Promise<Library[]> {
    return this.repo.find({ relations: ['billingPlan'] });
  }

  findById(id: string): Promise<Library | null> {
    return this.repo.findOne({ where: { id }, relations: ['billingPlan'] });
  }

  findByIdWithPlan(id: string): Promise<Library | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['billingPlan'],
    });
  }

  save(library: Partial<Library>): Promise<Library> {
    return this.repo.save(library);
  }

  async incrementStudentCount(libraryId: string): Promise<void> {
    await this.repo.increment({ id: libraryId }, 'currentStudentCount', 1);
  }
}
