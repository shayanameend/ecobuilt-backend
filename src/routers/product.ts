import { Router } from "express";

import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "~/controllers/product";
import { verifyRequest } from "~/middlewares/auth";

const productRouter = Router();

productRouter.get(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    isVerified: true,
  }),
  getProducts,
);

productRouter.get(
  "/:id",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    isVerified: true,
  }),
  getProduct,
);

productRouter.post(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    allowedStatus: ["APPROVED"],
    allowedRoles: ["VENDOR"],
    isVerified: true,
  }),
  createProduct,
);

productRouter.put(
  "/:id",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    allowedStatus: ["APPROVED"],
    allowedRoles: ["ADMIN", "VENDOR"],
    isVerified: true,
  }),
  updateProduct,
);

export { productRouter };
