import { RentingRoom } from "@/generated/prisma/client";
import prisma from "@/services/prisma-service";

export class RentingRoomsRepository {
  async create(data: RentingRoom): Promise<RentingRoom> {
    return prisma.rentingRoom.create({ data });
  }
}

const rentingRoomsRepository = new RentingRoomsRepository();
export default rentingRoomsRepository;
