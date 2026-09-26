import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_INSTRUMENT_NAME,
  PRIMARY_MONEY_ACCOUNT_ID,
  UNCLASSIFIED_CATEGORY_NAME,
} from "../src/features/money/default-records";
import { normalizeMoneyName } from "../src/features/money/names";
import { loadDatabaseEnvironment } from "./load-environment";

loadDatabaseEnvironment();

const prisma = new PrismaClient();

const seed = async () => {
  const defaultInstrumentNormalizedName = normalizeMoneyName(
    DEFAULT_INSTRUMENT_NAME,
  );
  const unclassifiedCategoryNormalizedName = normalizeMoneyName(
    UNCLASSIFIED_CATEGORY_NAME,
  );

  const [defaultInstrument] = await Promise.all([
    prisma.instrument.upsert({
      where: { normalizedName: defaultInstrumentNormalizedName },
      update: {},
      create: {
        name: DEFAULT_INSTRUMENT_NAME,
        normalizedName: defaultInstrumentNormalizedName,
      },
    }),
    prisma.category.upsert({
      where: { normalizedName: unclassifiedCategoryNormalizedName },
      update: {},
      create: {
        name: UNCLASSIFIED_CATEGORY_NAME,
        normalizedName: unclassifiedCategoryNormalizedName,
        isSystem: true,
      },
    }),
  ]);

  await prisma.moneyAccount.upsert({
    where: { id: PRIMARY_MONEY_ACCOUNT_ID },
    update: {},
    create: {
      id: PRIMARY_MONEY_ACCOUNT_ID,
      defaultInstrumentId: defaultInstrument.id,
    },
  });
};

seed()
  .then(() => console.info("Default money records created."))
  .catch((error: unknown) => {
    console.error("Could not create default money records.", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
