import { MoneyDirection } from "./money";
import { MoneyValidationError } from "./validation-error";

type SelectableCategory = {
  id: string;
  usage: "IN" | "OUT" | "BOTH";
  isArchived: boolean;
  childCount: number;
};

export function validateCategoryAssignment(
  category: SelectableCategory,
  direction: MoneyDirection,
  existingCategoryId?: string,
) {
  if (category.childCount > 0)
    throw new MoneyValidationError(
      "Choose a subcategory instead of its parent.",
    );
  if (category.isArchived && category.id !== existingCategoryId)
    throw new MoneyValidationError("Choose an active category.");
  if (category.usage !== "BOTH" && category.usage !== direction)
    throw new MoneyValidationError(
      "This category does not support the selected direction.",
    );
}
