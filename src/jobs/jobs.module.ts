import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";
import { Job, JobSchema } from "./jobs.model";
import { ScraperService } from "./scraper.service"; // ✅ Import ScraperService

@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
  controllers: [JobsController],
  providers: [JobsService, ScraperService], // ✅ Register ScraperService
  exports: [ScraperService], // ✅ Export ScraperService (if needed in other modules)
})
export class JobsModule {}
