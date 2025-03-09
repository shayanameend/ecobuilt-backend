import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "~/controllers/category";
import { verifyRequest } from "~/middlewares/auth";

const categoryRouter = Router();

categoryRouter.get(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    isVerified: true,
  }),
  getCategories,
);

categoryRouter.post(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    allowedStatus: ["APPROVED"],
    allowedRoles: ["ADMIN", "VENDOR"],
    isVerified: true,
  }),
  createCategory,
);

categoryRouter.put(
  "/:id",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    allowedStatus: ["APPROVED"],
    allowedRoles: ["ADMIN"],
    isVerified: true,
  }),
  updateCategory,
);

categoryRouter.delete(
  "/:id",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    allowedStatus: ["APPROVED"],
    allowedRoles: ["ADMIN"],
    isVerified: true,
  }),
  deleteCategory,
);

export { categoryRouter };
