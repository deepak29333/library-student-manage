import { Context } from 'koa';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { StudentService } from './student.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { success } from '../../utils/response.util';

export class StudentController {
  private studentService: StudentService;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.studentService = new StudentService();
    this.subscriptionService = new SubscriptionService();
  }

  createStudent = async (ctx: Context) => {
    const dto = plainToInstance(CreateStudentDto, ctx.request.body);
    await validateOrReject(dto);

    const { libraryId } = ctx.state.user;

    if (!libraryId) {
      ctx.status = 400;
      ctx.body = { success: false, message: 'No library associated with this admin', data: null };
      return;
    }

    const result = await this.studentService.createStudent(
      libraryId,
      dto.name,
      dto.email,
      dto.password,
      dto.seatNumber,
      dto.joinDate,
    );

    ctx.status = 201;
    ctx.body = success(result, 'Student created successfully');
  };

  getStudents = async (ctx: Context) => {
    const { libraryId } = ctx.state.user;

    if (!libraryId) {
      ctx.status = 400;
      ctx.body = { success: false, message: 'No library associated with this admin', data: null };
      return;
    }

    const students = await this.studentService.getStudentsByLibrary(libraryId);
    ctx.status = 200;
    ctx.body = success(students);
  };

  getStudentById = async (ctx: Context) => {
    const { id } = ctx.params;
    const { libraryId } = ctx.state.user;

    const student = await this.studentService.getStudentById(id, libraryId);
    ctx.status = 200;
    ctx.body = success(student);
  };

  getMyProfile = async (ctx: Context) => {
    const { userId } = ctx.state.user;
    const profile = await this.studentService.getMyProfile(userId);
    ctx.status = 200;
    ctx.body = success(profile);
  };

  getMySubscription = async (ctx: Context) => {
    const { userId } = ctx.state.user;
    const profile = await this.studentService.getMyProfile(userId);
    const subscription = await this.subscriptionService.getSubscriptionByStudentId(
      profile.id,
    );

    if (!subscription) {
      ctx.status = 404;
      ctx.body = { success: false, message: 'No subscription found', data: null };
      return;
    }

    ctx.status = 200;
    ctx.body = success(subscription);
  };
}
