import { CategoryStatus } from "@prisma/client";

import * as zod from "zod";

const createCategoryBodySchema = zod.object({
  name: zod
    .string({
      message: "Name must be a string!",
    })
    .min(3, {
      message: "Name must be at least 3 characters long!",
    })
    .max(255, {
      message: "Name must be at most 255 characters long!",
    }),
  status: zod.enum(
    [CategoryStatus.PENDING, CategoryStatus.APPROVED, CategoryStatus.REJECTED],
    {
      message: "Status must be one of 'PENDING', 'APPROVED', or 'REJECTED'!",
    },
  ),
});

const updateCategoryParamsSchema = zod.object({
  id: zod.string({
    message: "ID must be a string!",
  }),
});

const updateCategoryBodySchema = zod.object({
  name: zod
    .string({
      message: "Name must be a string!",
    })
    .min(3, {
      message: "Name must be at least 3 characters long!",
    })
    .max(255, {
      message: "Name must be at most 255 characters long!",
    }),
  status: zod.enum(
    [CategoryStatus.PENDING, CategoryStatus.APPROVED, CategoryStatus.REJECTED],
    {
      message: "Status must be one of 'PENDING', 'APPROVED', or 'REJECTED'!",
    },
  ),
});

const deleteCategoryParamsSchema = zod.object({
  id: zod.string({
    message: "ID must be a string!",
  }),
});

export {
  createCategoryBodySchema,
  updateCategoryParamsSchema,
  updateCategoryBodySchema,
  deleteCategoryParamsSchema,
};
