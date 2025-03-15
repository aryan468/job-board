import { Controller, Get, Param } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Job } from "./jobs.model";

@Controller("jobs")
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    @InjectModel(Job.name) private jobModel: Model<Job>
  ) {}

  // ✅ API to trigger job scraping
  @Get("crawl/:keyword")
  async crawlJobs(@Param("keyword") keyword: string) {
    await this.jobsService.fetchJobs(keyword);
    return { message: "✅ Job data refreshed" };
  }

  // ✅ API to fetch all stored jobs
  @Get()
  async getJobs() {
    return this.jobModel.find();
  }
}
