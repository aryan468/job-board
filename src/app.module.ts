import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsModule } from './jobs/jobs.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),  
    MongooseModule.forRoot(process.env.DATABASE_URL || ''), // ✅ Prevents 'undefined' error
    JobsModule,
  ],
})
export class AppModule {}
