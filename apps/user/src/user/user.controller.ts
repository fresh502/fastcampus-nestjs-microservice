import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'findOneByEmail' })
  async findOneByEmail(email: string): Promise<{ id: string }> {
    const user = await this.userService.findOneByEmail(email);
    return { id: user?.id || null };
  }

  @MessagePattern({ cmd: 'create' })
  async create({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ id: string }> {
    const user = await this.userService.create(email, password);
    return { id: user.id };
  }
}
