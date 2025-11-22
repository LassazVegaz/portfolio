"use server";

export const fetchData = async (formData: FormData) => {
  console.log(formData.entries().toArray());
};
