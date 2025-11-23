"use server";
import { carousellService as cs } from "@/services/carousell-service";

export const fetchData = async (formData: FormData) => {
  const url = formData.get("roomLink");
  if (typeof url !== "string") throw new Error("roomLink is not a string");

  await cs.loadCache(url);
  console.log(cs.getData());
};
