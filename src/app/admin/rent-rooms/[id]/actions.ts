"use server";
import cs from "@/services/cs-scrapping-service";
import roomsRepo from "@/repositories/renting-rooms-repository";

export const fetchData = async (formData: FormData) => {
  const url = formData.get("roomLink");
  if (typeof url !== "string") throw new Error("roomLink is not a string");

  await cs.loadData(url);
  const data = cs.getData();

  await roomsRepo.create(data);
};
