import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './user/config/postgres.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
          synchronize: false,
        };
        // 주의! local 환경에서만 개발 편의성을 위해 활용
        if (configService.get('STAGE') === 'local') {
          obj = Object.assign(obj, {
            logging: true,
            synchronize: true,
          });
        }
        return obj;
      },
    }),
    UserModule,
  ],
})
export class AppModule {}
