"use server";
import cs from "@/services/cs-scrapping-service";
import roomsRepo from "@/repositories/renting-rooms-repository";
import authService from "@/services/auth-service";

export const fetchData = async (formData: FormData) => {
  await authService.requireAuthenticatedUser();
  const url = formData.get("roomLink");
  if (typeof url !== "string") throw new Error("roomLink is not a string");

  await cs.loadData(url);
  const data = cs.getData();

  await roomsRepo.create(data);
};
