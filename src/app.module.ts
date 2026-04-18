import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfilesModule } from './profiles/profiles.module';
import { ExternalModule } from './external/external.module';
import { Profile } from './profiles/entities/profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT') || '5432'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [Profile],
        synchronize: true, // Creates tables automatically
        ssl:
          configService.get('DATABASE_SSL') === 'true'
            ? {
                rejectUnauthorized: false,
              }
            : false,
        logging: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    ProfilesModule,
    ExternalModule,
  ],
})
export class AppModule {}
