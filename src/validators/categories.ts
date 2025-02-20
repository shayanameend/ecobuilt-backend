import { default as zod } from "zod";

const createCategoryBodySchema = zod.object({
  name: zod
    .string({
      message: "Invalid Category Name",
    })
    .min(3, {
      message: "Category Name must be at least 3 characters long",
    })
    .max(32, {
      message: "Category Name must be at most 32 characters long",
    }),
});

const updateCategoryParamSchema = zod.object({
  id: zod.string({
    message: "Invalid Category ID",
  }),
});

const updateCategoryBodySchema = zod.object({
  name: zod
    .string({
      message: "Invalid Category Name",
    })
    .min(3, {
      message: "Category Name must be at least 3 characters long",
    })
    .max(32, {
      message: "Category Name must be at most 32 characters long",
    })
    .optional(),
  isDeleted: zod
    .boolean({
      message: "Invalid isDeleted",
    })
    .optional(),
});

const deleteCategoryParamSchema = zod.object({
  id: zod.string({
    message: "Invalid Category ID",
  }),
});

export {
  createCategoryBodySchema,
  updateCategoryParamSchema,
  updateCategoryBodySchema,
  deleteCategoryParamSchema,
};
