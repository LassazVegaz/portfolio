"use server";
import cs from "@/services/cs-scrapping-service";

export const fetchData = async (formData: FormData) => {
  const url = formData.get("roomLink");
  if (typeof url !== "string") throw new Error("roomLink is not a string");

  await cs.loadCache(url);
  console.log(cs.getData());
};
