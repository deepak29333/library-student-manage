import { Context } from 'koa';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { success } from '../../utils/response.util';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (ctx: Context) => {
    const dto = plainToInstance(LoginDto, ctx.request.body);
    await validateOrReject(dto);

    const result = await this.authService.login(dto.email, dto.password);
    ctx.status = 200;
    ctx.body = success(result, 'Login successful');
  };
}
