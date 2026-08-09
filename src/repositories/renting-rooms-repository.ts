import prisma from "@/services/prisma-service";
import { RentingRoom } from "@prisma/client";

export class RentingRoomsRepository {
  async create(data: RentingRoom): Promise<RentingRoom> {
    return prisma.rentingRoom.create({ data });
  }
}

const rentingRoomsRepository = new RentingRoomsRepository();
export default rentingRoomsRepository;
