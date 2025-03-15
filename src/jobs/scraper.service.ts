import puppeteer from "puppeteer";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeJobs(keyword: string) {
    const browser = await puppeteer.launch({
      headless: false, // ❌ Set TRUE when fully tested
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const pages = await browser.pages();
    if (pages.length > 1) await pages[0].close(); // ✅ Close "about:blank" tab

    const page = await browser.newPage();
    try {
      const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}`;
      this.logger.log(`🔍 Navigating to: ${url}`);

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 }); // ⏳ Increased timeout

      // ✅ Check if blocked (Captcha or Login page)
      const pageTitle = await page.title();
      if (pageTitle.includes("LinkedIn Login") || pageTitle.includes("Verify")) {
        this.logger.error("❌ LinkedIn blocked the scraper (Login or Captcha required)");
        return [];
      }

      // ✅ Ensure page fully loads
      await page.waitForSelector("body", { timeout: 60000 });

      // ✅ Wait for jobs list (LinkedIn changed class name)
      await page.waitForSelector(".jobs-search-results", { timeout: 90000 });

      // ✅ Scroll to load more jobs
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // ✅ Debug: Take screenshot
      await page.screenshot({ path: "linkedin_debug.png", fullPage: true });

      // ✅ Extract job listings
      const jobs = await page.evaluate(() => {
        const jobList: any[] = [];
        document.querySelectorAll(".job-card-container").forEach((job: any) => {
          jobList.push({
            title: job.querySelector(".job-card-list__title")?.innerText.trim() || "N/A",
            company: job.querySelector(".job-card-container__company-name")?.innerText.trim() || "N/A",
            location: job.querySelector(".job-card-container__metadata-item")?.innerText.trim() || "N/A",
            applyLink: job.querySelector("a")?.href || "N/A",
          });
        });
        return jobList;
      });

      this.logger.log(`✅ Successfully scraped ${jobs.length} jobs for keyword: ${keyword}`);
      return jobs;
    } catch (error) {
      this.logger.error(`❌ Error scraping jobs: ${error.message}`);
      return [];
    } finally {
      await browser.close();
      this.logger.log("✅ Browser closed");
    }
  }
}
