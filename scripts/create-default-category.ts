import { PrismaClient } from "@prisma/client";
import { UNCLASSIFIED_CATEGORY_NAME } from "../src/features/money/default-records";
import { normalizeMoneyName } from "../src/features/money/names";
import { loadScriptEnvironment } from "./lib/load-environment";

async function main() {
  loadScriptEnvironment();
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL is required to create the default category.");

  const prisma = new PrismaClient();
  try {
    const category = await prisma.category.upsert({
      where: { normalizedName: normalizeMoneyName(UNCLASSIFIED_CATEGORY_NAME) },
      update: {},
      create: {
        name: UNCLASSIFIED_CATEGORY_NAME,
        normalizedName: normalizeMoneyName(UNCLASSIFIED_CATEGORY_NAME),
        isSystem: true,
        parentId: null,
        description: null,
        usage: "BOTH",
        isArchived: false,
        monthlyBudgetCents: 0,
      },
    });
    console.info(
      `Default category is ready: ${category.name} (${category.id}).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Could not create the default category.", error);
  process.exitCode = 1;
});
