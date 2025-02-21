import { Router } from "express";

import {
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
} from "~/controllers/vendor";
import { verifyRequest } from "~/middlewares/auth";

const vendorsRouter = Router();

vendorsRouter.get("/", getVendors);

vendorsRouter.post(
  "/",
  verifyRequest({
    role: "ADMIN",
    isVerified: true,
  }),
  createVendor,
);

vendorsRouter.put(
  "/:id",
  verifyRequest({
    role: "ADMIN",
    isVerified: true,
  }),
  updateVendor,
);

vendorsRouter.delete(
  "/:id",
  verifyRequest({
    role: "ADMIN",
    isVerified: true,
  }),
  deleteVendor,
);

export { vendorsRouter };
