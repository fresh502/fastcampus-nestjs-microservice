import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { RefreshToken } from './entity/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async signup(email: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let error;
    try {
      const userId = await this.userService.findOneByEmail(email);
      if (userId) throw new BadRequestException();
      const newUserId = await this.userService.create(email, password);
      const accessToken = this.genereateAccessToken(newUserId);
      const refreshTokenEntity = queryRunner.manager.create(RefreshToken, {
        userId: newUserId,
        token: this.genereateRefreshToken(newUserId),
      });
      queryRunner.manager.save(refreshTokenEntity);
      await queryRunner.commitTransaction();
      return {
        id: newUserId,
        accessToken,
        refreshToken: refreshTokenEntity.token,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async signin(email: string, password: string) {
    const userId = await this.userService.validateUser(email, password);

    const refreshToken = this.genereateRefreshToken(userId);
    await this.createRefreshTokenUsingUser(userId, refreshToken);
    return {
      accessToken: this.genereateAccessToken(userId),
      refreshToken,
    };
  }

  async refresh(token: string, userId: string) {
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      token,
    });
    if (!refreshTokenEntity) throw new BadRequestException();
    const accessToken = this.genereateAccessToken(userId);
    const refreshToken = this.genereateRefreshToken(userId);
    refreshTokenEntity.token = refreshToken;
    await this.refreshTokenRepository.save(refreshTokenEntity);
    return { accessToken, refreshToken };
  }

  private genereateAccessToken(userId: string) {
    const payload = { sub: userId, tokenType: 'access' };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  private genereateRefreshToken(userId: string) {
    const payload = { sub: userId, tokenType: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  private async createRefreshTokenUsingUser(
    userId: string,
    refreshToken: string,
  ) {
    let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      userId,
    });
    if (refreshTokenEntity) {
      refreshTokenEntity.token = refreshToken;
    } else {
      refreshTokenEntity = this.refreshTokenRepository.create({
        userId,
        token: refreshToken,
      });
    }
    await this.refreshTokenRepository.save(refreshTokenEntity);
  }
}
