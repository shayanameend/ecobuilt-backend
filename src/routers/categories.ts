import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "~/controllers/categories";
import { verifyRequest } from "~/middlewares/auth";

const categoriesRouter = Router();

categoriesRouter.get("/", getCategories);

categoriesRouter.post(
  "/",
  verifyRequest({
    role: "ADMIN",
    isVerified: true,
  }),
  createCategory,
);

categoriesRouter.put(
  "/:id",
  verifyRequest({
    role: "ADMIN",
    isVerified: true,
  }),
  updateCategory,
);

categoriesRouter.delete(
  "/:id",
  verifyRequest({
    role: "ADMIN",
    isVerified: true,
  }),
  deleteCategory,
);

export { categoriesRouter };
