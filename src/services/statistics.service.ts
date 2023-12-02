import { removeTimeFromDate } from "@/lib/datetime";
import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";

export class StatisticsService {
  constructor(private readonly prisma: PrismaClient) {}

  async addView() {
    const date = removeTimeFromDate(new Date());
    const view = await this.prisma.statistics.findUnique({
      where: { date },
    });
    if (view) {
      await this.prisma.statistics.update({
        where: { date },
        data: { views: view.views + 1 },
      });
    } else {
      await this.prisma.statistics.create({
        data: { date, views: 1 },
      });
    }
  }
}

const statisticsService = new StatisticsService(prisma);
export default statisticsService;
