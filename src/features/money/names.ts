export const cleanMoneyName = (name: string) =>
  name.trim().replace(/\s+/g, " ");

export const normalizeMoneyName = (name: string) =>
  cleanMoneyName(name).toLocaleLowerCase("en-US");
