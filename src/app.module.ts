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
        host: configService.get('SUPABASE_HOST'),
        port: parseInt(configService.get('SUPABASE_PORT') || '5432'),
        username: configService.get('SUPABASE_USER'),
        password: configService.get('SUPABASE_PASSWORD'),
        database: configService.get('SUPABASE_DATABASE'),
        entities: [Profile],
        synchronize: true, // This will create tables automatically
        ssl: {
          rejectUnauthorized: false, // Required for Supabase
        },
        extra: {
          max: 20, // Connection pool size
        },
      }),
    }),
    ProfilesModule,
    ExternalModule,
  ],
})
export class AppModule {}
