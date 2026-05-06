import puppeteer, { Browser } from "puppeteer";
import fs from "fs/promises";
import path from "path";

const SCREENSHOTS_DIR = path.resolve("public/screenshots");
const VIEWPORT = { width: 1440, height: 900 };

const designs: { id: string; url: string }[] = [
  { id: "linear-app", url: "https://linear.app" },
  { id: "vercel-platform", url: "https://vercel.com" },
  { id: "stripe-checkout", url: "https://stripe.com" },
  { id: "raycast-store", url: "https://raycast.com" },
  { id: "cursor-so", url: "https://cursor.com" },
  { id: "apple-design", url: "https://www.apple.com" },
];

async function generateScreenshots() {
  let browser: Browser | null = null;

  try {
    await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });
    console.log(`Screenshots will be saved to: ${SCREENSHOTS_DIR}\n`);

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    for (const design of designs) {
      const outputPath = path.join(SCREENSHOTS_DIR, `${design.id}.png`);

      try {
        console.log(`Capturing ${design.id} (${design.url})...`);

        await page.goto(design.url, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        // Allow extra time for fonts and animations to settle
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Get full page height for a tall screenshot
        const bodyHeight = await page.evaluate(() => {
          return Math.min(document.body.scrollHeight, window.innerHeight * 3);
        });

        await page.setViewport({ ...VIEWPORT, height: bodyHeight });

        await page.screenshot({
          path: outputPath,
          fullPage: true,
          type: "png",
        });

        console.log(`  ✓ Saved ${design.id}.png`);
      } catch (error) {
        console.error(`  ✗ Failed: ${error instanceof Error ? error.message : error}`);
      }
    }

    console.log("\nDone!");
  } finally {
    if (browser) await browser.close();
  }
}

generateScreenshots();
