import { Context } from 'koa';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { CreateLibraryAdminDto } from './dto/create-library-admin.dto';
import { success } from '../../utils/response.util';

export class LibraryController {
  private libraryService: LibraryService;

  constructor() {
    this.libraryService = new LibraryService();
  }

  createLibrary = async (ctx: Context) => {
    const dto = plainToInstance(CreateLibraryDto, ctx.request.body);
    await validateOrReject(dto);

    const library = await this.libraryService.createLibrary(dto.name);
    ctx.status = 201;
    ctx.body = success(library, 'Library created successfully');
  };

  getAllLibraries = async (ctx: Context) => {
    const libraries = await this.libraryService.getAllLibraries();
    ctx.status = 200;
    ctx.body = success(libraries);
  };

  createLibraryAdmin = async (ctx: Context) => {
    const dto = plainToInstance(CreateLibraryAdminDto, ctx.request.body);
    await validateOrReject(dto);

    const admin = await this.libraryService.createLibraryAdmin(
      dto.name,
      dto.email,
      dto.password,
      dto.libraryId,
    );
    ctx.status = 201;
    ctx.body = success(admin, 'Library admin created successfully');
  };

  assignPlan = async (ctx: Context) => {
    const dto = plainToInstance(AssignPlanDto, ctx.request.body);
    await validateOrReject(dto);

    const library = await this.libraryService.assignPlan(
      dto.libraryId,
      dto.billingPlanId,
    );
    ctx.status = 200;
    ctx.body = success(library, 'Billing plan assigned successfully');
  };

  getAllBillingPlans = async (ctx: Context) => {
    const plans = await this.libraryService.getAllBillingPlans();
    ctx.status = 200;
    ctx.body = success(plans);
  };
}
