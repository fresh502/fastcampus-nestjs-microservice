import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async create(email: string, password: string) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const userEntity = this.userRepository.create({
      email,
      password: hash,
    });
    const user = await this.userRepository.save(userEntity);
    return user;
  }
}
