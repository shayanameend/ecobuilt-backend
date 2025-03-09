import { Router } from "express";

import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "~/controllers/product";
import { verifyRequest } from "~/middlewares/auth";
import { uploadMultiple } from "~/middlewares/upload";

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
  uploadMultiple("pictures"),
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
  uploadMultiple("pictures"),
  updateProduct,
);

export { productRouter };
