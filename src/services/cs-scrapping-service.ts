import CarousellScrappedData from "@/app/models/carousell-scrapped-data.model";
import { CheerioAPI, load } from "cheerio";
import fs from "node:fs/promises";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const cacheFile = "D:/My Apps/NextJs/my/portfolio/data/cache.html";

/**
 * Initial data those should be loaded before scrapping data
 */
type InitialData = {
  $: CheerioAPI;
  id: string;
};

type Label =
  | "Air-Conditioning"
  | "Cooking"
  | "Internet"
  | "No Owner Staying"
  | "PUB Included"
  | "Visitors allowed"
  | "Furnishing"
  | "Lease"
  | "Level"
  | "Type"
  | "Room"
  | "Gender"
  | "MRT"
  | "Postal Code"
  | "Street Name";

export class CarousellScrappingService {
  private initialData: InitialData | null = null;

  //#region
  async loadData(url: string) {
    try {
      await fs.access(cacheFile, fs.constants.F_OK);
      console.log("cache found");
    } catch {
      this.createFile(url);
    }

    const html = await fs.readFile(cacheFile, "utf-8");

    this.initialData = {
      $: load(html),
      id: this.getIdFromUrl(url),
    };
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

  getData(): CarousellScrappedData {
    if (this.initialData === null)
      throw new Error(
        "Initial data is not loaded. Please call loadCache before getData"
      );
    const { $, id } = this.initialData;

    return {
      id,
      name: this.getName($),
      price: this.getPrice($),
      description: this.getDescription($),
      images: this.getImageUrls($),
      ac: this.isItYes("Air-Conditioning", $),
      cookingAllowed: this.isItYes("Cooking", $),
      hasInternet: this.isItYes("Internet", $),
      noOwnerStaying: this.isItYes("No Owner Staying", $),
      pubIncluded: this.isItYes("PUB Included", $),
      visitorsAllowed: this.isItYes("Visitors allowed", $),
      furnishing: this.getLabelValue("Furnishing", $),
      lease: this.getLabelValue("Lease", $),
      level: this.getLabelValue("Level", $),
      type: this.getLabelValue("Type", $),
      room: this.getLabelValue("Room", $),
      gender: this.getLabelValue("Gender", $),
      mrt: this.getLabelValue("MRT", $),
      postalCode: this.getLabelValue("Postal Code", $),
      streetName: this.getLabelValue("Street Name", $),
    };
  }

  private isItYes(label: Label, $: CheerioAPI) {
    return this.getLabelValue(label, $).toLowerCase() === "yes";
  }

  private getLabelValue(label: Label, $: CheerioAPI) {
    return $(`p:contains('${label}')`)
      .parent()
      .find("div span")
      .first()
      .text()
      .trim();
  }

  private getName($: CheerioAPI) {
    return $("h1").text().trim();
  }

  private getPrice($: CheerioAPI) {
    return Number.parseFloat(
      $("h1").next().children("p").text().trim().slice(2).replaceAll(",", "")
    );
  }

  private getDescription($: CheerioAPI) {
    return $("p:contains('Description')")
      .next()
      .find("p")
      .text()
      .trim()
      .split("\n")
      .map((s) => s.trim())
      .join(" ");
  }

  private getImageUrls($: CheerioAPI) {
    return $("[aria-label=Carousel]")
      .find("img")
      .map((_, e) => e.attribs["src"])
      .toArray();
  }

  private getIdFromUrl(url: string) {
    const partBeforeParams = url.split("?")[0];
    const parts = partBeforeParams.split("-");
    let id = parts[parts.length - 1];
    if (id[id.length - 1] === "/") id = id.substring(0, id.length - 1);
    return id;
  }
}

const carousellScrappingService = new CarousellScrappingService();

export default carousellScrappingService;
