import { RentingRoom } from "@/generated/prisma/client";

type CarousellScrappedData = RentingRoom & {
  images: string[];
};

export default CarousellScrappedData;
