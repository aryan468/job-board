import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Job } from "./jobs.model";
import { ScraperService } from "./scraper.service";

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    private readonly scraperService: ScraperService
  ) {}

  async fetchJobs(keyword: string): Promise<void> {
    this.logger.log(`🔍 Fetching jobs for keyword: ${keyword}`);

    // Call Puppeteer scraper
    const jobs = await this.scraperService.scrapeJobs(keyword);

    if (jobs.length === 0) {
      this.logger.warn("❌ No jobs found. Skipping database update.");
      return;
    }

    // Clear old jobs before inserting new ones
    await this.jobModel.deleteMany({});
    await this.jobModel.insertMany(jobs);

    this.logger.log(`✅ Stored ${jobs.length} new jobs in the database.`);
  }
}
