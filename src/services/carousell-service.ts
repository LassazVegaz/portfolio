import { CheerioAPI, load } from "cheerio";
import fs from "node:fs/promises";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const cacheFile = "D:/My Apps/NextJs/my/portfolio/data/cache.html";

export class CarousellService {
  private $: CheerioAPI | null = null;

  private readonly labels = [
    "Air-Conditioning",
    "Cooking",
    "Internet",
    "No Owner Staying",
    "PUB Included",
    "Visitors allowed",
    "Furnishing",
    "Lease",
    "Level",
    "Type",
    "Room",
    "Gender",
  ];

  //#region
  async loadCache(url: string) {
    try {
      await fs.access(cacheFile, fs.constants.F_OK);
      console.log("cache found");
    } catch {
      this.createFile(url);
    }

    const html = await fs.readFile(cacheFile, "utf-8");
    this.$ = load(html);
  }

  private async createFile(url: string) {
    const res = await fetch(url, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
      },
    });
    const text = await res.text();
    await fs.writeFile(cacheFile, text);
  }
  //#endregion

  getData() {
    if (this.$ === null) throw new Error("cache is not loaded");
    const $ = this.$;

    const data: Record<string, unknown> = {};

    this.labels.forEach((l) => (data[l] = this.getLabelValue(l, $)));

    data["Name"] = this.getName($);

    return data;
  }

  private getLabelValue(label: string, $: CheerioAPI) {
    return $(`p:contains('${label}')`)
      .parent()
      .find("div span")
      .first()
      .text()
      .trim();
  }

  getName($: CheerioAPI) {
    return $("h1").text().trim();
  }
}

export const carousellService = new CarousellService();
